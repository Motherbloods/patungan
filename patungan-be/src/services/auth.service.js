const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const LoginToken = require("../models/login-token");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
  console.log("🚀 verifyLoginTokenService called:", loginToken);

  if (!loginToken) {
    console.log("❌ Login token missing");
    throw { status: 400, message: "Login token required" };
  }

  const tokenDoc = await LoginToken.findOne({ token: loginToken });
  console.log("🔎 Token from DB:", tokenDoc);

  if (!tokenDoc) {
    console.log("❌ Token not found in DB");
    throw { status: 404, message: "Invalid token" };
  }

  console.log("📌 Token status:", tokenDoc.status);
  console.log("⏰ Token expiresAt:", tokenDoc.expiresAt);

  if (tokenDoc.status === "expired" || tokenDoc.expiresAt < new Date()) {
    console.log("⏰ Token expired condition met");

    throw { status: 401, message: "Token expired" };
  }

  if (tokenDoc.status === "pending") {
    console.log("⌛ Token still pending (waiting for Telegram)");

    return {
      status: "pending",
      isAuthenticated: false,
      message: "Waiting for Telegram confirmation",
    };
  }

  if (tokenDoc.status === "used" && tokenDoc.telegramId) {
    console.log("✅ Token already used, fetching user...");

    const user = await User.findOne({
      "providers.telegram.id": tokenDoc.telegramId,
    }).select("-__v");

    console.log("👤 User found:", user);

    if (!user) {
      console.log("❌ User not found");
      throw { status: 404, message: "User not found" };
    }

    console.log("🔐 Generating JWT token");

    const jwtToken = generateToken(user._id);

    const result = {
      jwtToken,
      isAuthenticated: true,
      user: formatUser(user),
    };

    console.log("🎉 Final result:", result);

    await LoginToken.deleteOne({ _id: tokenDoc._id });

    return result;
  }

  console.log("❌ Invalid token status:", tokenDoc.status);

  throw { status: 400, message: "Invalid token status" };
};

const verifyAuthService = async (userId) => {
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await User.findById(userId).select("-__v");

  if (!user) throw new AppError("User not found", 404);

  return formatUser(user);
};
module.exports = {
  requestLoginService,
  verifyLoginTokenService,
  verifyAuthService,
};
