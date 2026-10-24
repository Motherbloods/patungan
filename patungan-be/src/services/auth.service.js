const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const LoginToken = require("../models/login-token");
const LinkToken = require("../models/link-token");
const Group = require("../models/group");
const { OAuth2Client } = require("google-auth-library");
const AppError = require("../errors/AppError");
const { normalizeGuestId } = require("../utils/guest");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

const formatUser = (user) => {
  const providers = [];
  if (user.providers?.google?.id) providers.push("google");
  if (user.providers?.telegram?.id) providers.push("telegram");

  return {
    id: user._id.toString(),
    username: user.username,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    providers,
    avatar: user.avatar ?? null,
  };
};

const requestLoginService = async () => {
  const loginToken = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await LoginToken.create({
    token: loginToken,
    status: "pending",
    expiresAt,
  });

  const botUsername = process.env.TELEGRAM_BOT;
  const telegramUrl = `https://t.me/${botUsername}?start=${loginToken}`;

  return {
    token: loginToken,
    telegramUrl,
    expiresIn: 300,
  };
};

const verifyLoginTokenService = async (loginToken) => {
  if (!loginToken) {
    throw new AppError("Login token required", 400);
  }

  const sanitizedToken = String(loginToken).trim();
  const tokenDoc = await LoginToken.findOne({ token: sanitizedToken }).lean();

  if (!tokenDoc) {
    throw new AppError("Invalid token", 404);
  }

  if (tokenDoc.status === "expired" || tokenDoc.expiresAt < new Date()) {
    throw new AppError("Token expired", 401);
  }

  if (tokenDoc.status === "pending") {
    return {
      status: "pending",
      isAuthenticated: false,
      message: "Waiting for Telegram confirmation",
    };
  }

  if (tokenDoc.status === "used" && tokenDoc.telegramId) {
    const user = await User.findOne({
      "providers.telegram.id": String(tokenDoc.telegramId),
    }).select("-__v");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const jwtToken = generateToken(user._id);

    const result = {
      jwtToken,
      isAuthenticated: true,
      user: formatUser(user),
    };

    await LoginToken.deleteOne({ _id: tokenDoc._id });

    return result;
  }

  throw new AppError("Invalid token status", 400);
};

const verifyAuthService = async (userId) => {
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await User.findById(userId).select("-__v");

  if (!user) throw new AppError("User not found", 404);

  return formatUser(user);
};

const loginWithGoogleService = async (tokenId) => {
  if (!tokenId) {
    throw new AppError("Google tokenId is required", 400);
  }

  const ticket = await client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .catch(() => {
      throw new AppError("Invalid Google token", 401);
    });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AppError("Invalid Google token payload", 401);
  }

  if (!payload.email_verified) {
    throw new AppError("Google email is not verified", 401);
  }

  const {
    sub: googleId,
    email,
    name,
    picture,
    given_name,
    family_name,
  } = payload;

  let user = await User.findOne({ "providers.google.id": googleId }).select(
    "-__v",
  );

  if (!user && email) {
    user = await User.findOne({ email }).select("-__v");

    if (user) {
      const existingGoogle = await User.findOne({
        "providers.google.id": googleId,
      });

      if (
        existingGoogle &&
        existingGoogle._id.toString() !== user._id.toString()
      ) {
        throw new AppError("Google account already linked to another user.", 409);
      }

      user.providers.google = {
        id: googleId,
        email: email,
      };

      if (!user.avatar) {
        user.avatar = picture;
      }

      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      email,
      username: name || email,
      firstName: given_name || null,
      lastName: family_name || null,
      avatar: picture || null,
      providers: {
        google: {
          id: googleId,
          email: email,
        },
      },
    });
  }

  const token = generateToken(user._id);
  return { token, user: formatUser(user) };
};

const linkGoogleService = async (userId, idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new AppError("Invalid Google token", 400);
  if (!payload.email_verified)
    throw new AppError("Google email is not verified", 400);

  const { sub: googleId, email, picture } = payload;

  const existing = await User.findOne({ "providers.google.id": googleId });
  if (existing && existing._id.toString() !== userId) {
    throw new AppError("Akun Google ini sudah terhubung ke akun lain.", 409);
  }

  const user = await User.findById(userId);

  if (!user) throw new AppError("User not found", 404);
  if (user.providers?.google?.id)
    throw new AppError("Akun Google sudah terhubung ke akun ini.", 400);

  user.providers.google = { id: googleId, email };
  if (!user.avatar) user.avatar = picture;
  await user.save();

  return formatUser(user);
};

const requestLinkTelegramService = async (userId) => {
  await LinkToken.deleteMany({ userId, status: "pending" });

  const linkToken = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await LinkToken.create({
    token: linkToken,
    userId,
    status: "pending",
    expiresAt,
  });

  const botUsername = process.env.TELEGRAM_BOT;
  const telegramUrl = `https://t.me/${botUsername}?start=link_${linkToken}`;

  return { linkToken, telegramUrl, expiresIn: 300 };
};

const verifyLinkTokenService = async (linkToken, userId) => {
  const sanitizedToken = String(linkToken).trim();
  const sanitizedUserId = String(userId).trim();

  const tokenDoc = await LinkToken.findOne({
    token: sanitizedToken,
    userId: sanitizedUserId,
  });

  if (!tokenDoc) throw new AppError("Invalid token", 404);
  if (tokenDoc.status === "expired" || tokenDoc.expiresAt < new Date())
    throw new AppError("Token expired", 401);
  if (tokenDoc.status === "pending")
    return { status: "pending", linked: false };

  if (tokenDoc.status === "failed") {
    await LinkToken.deleteOne({ _id: tokenDoc._id });
    throw new AppError(tokenDoc.failReason || "Gagal menautkan akun.", 409);
  }

  if (tokenDoc.status === "used" || tokenDoc.status === "delivered") {
    const user = await User.findById(userId).select("-__v");

    // Tandai sebagai delivered, jangan hapus dulu
    if (tokenDoc.status === "used") {
      await LinkToken.updateOne({ _id: tokenDoc._id }, { status: "delivered" });
    }

    return { status: "success", linked: true, user: formatUser(user) };
  }

  throw new AppError("Invalid token status", 400);
};

const claimGuestDataService = async ({ userId, guestId }) => {
  const normalizedGuestId = normalizeGuestId(guestId);

  if (!userId) throw new AppError("Unauthorized", 401);
  if (!normalizedGuestId) {
    throw new AppError("Valid guest session is required", 400);
  }

  const session = await mongoose.startSession();
  let claimedGroups = 0;

  try {
    await session.withTransaction(async () => {
      const result = await Group.updateMany(
        {
          createdBy: null,
          guestId: normalizedGuestId,
        },
        {
          $set: { createdBy: userId },
          $unset: { guestId: 1 },
        },
        { session },
      );

      claimedGroups = result.modifiedCount ?? 0;
    });
  } finally {
    session.endSession();
  }

  return {
    claimedGroups,
    guestId: normalizedGuestId,
  };
};

module.exports = {
  requestLoginService,
  verifyLoginTokenService,
  verifyAuthService,
  loginWithGoogleService,
  linkGoogleService,
  requestLinkTelegramService,
  verifyLinkTokenService,
  claimGuestDataService,
};
