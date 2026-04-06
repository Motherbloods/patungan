const LoginToken = require("../models/login-token");
const User = require("../models/user");
const LinkToken = require("../models/link-token");

const confirmLoginService = async ({
  loginToken,
  telegramId,
  username,
  firstName,
  lastName,
}) => {
  if (!loginToken || !telegramId) {
    throw new AppError("Login token and Telegram ID required", 400);
  }

  const tokenDoc = await LoginToken.findOne({ token: loginToken });
  if (!tokenDoc) {
    throw new AppError("Invalid token", 404);
  }

  if (tokenDoc.status !== "pending") {
    throw new AppError("Token already used", 400);
  }

  if (tokenDoc.expiresAt < new Date()) {
    tokenDoc.status = "expired";
    await tokenDoc.save();
    throw new AppError("Token expired", 401);
  }

  let user = await User.findOne({ "providers.telegram.id": telegramId });
  if (!user) {
    user = await User.create({
      username: username || `user_${telegramId}`,
      firstName: firstName || null,
      lastName: lastName || null,
      providers: {
        telegram: {
          id: telegramId,
          username: username || null,
        },
      },
    });
  }

  tokenDoc.status = "used";
  tokenDoc.telegramId = telegramId;
  await tokenDoc.save();

  return {
    message: "Login confirmed successfully",
    user: {
      telegramId: user.providers.telegram.id,
      username: user.username,
    },
  };
};

const confirmLinkTelegramService = async ({
  linkToken,
  telegramId,
  username,
  firstName,
  lastName,
}) => {
  if (!linkToken || !telegramId) {
    throw new AppError("Link token and Telegram ID required", 400);
  }

  const tokenDoc = await LinkToken.findOne({ token: linkToken });
  if (!tokenDoc) throw new AppError("Invalid token", 404);
  if (tokenDoc.status !== "pending") {
    throw new AppError("Token already used", 400);
  }
  if (tokenDoc.expiresAt < new Date()) {
    tokenDoc.status = "expired";
    await tokenDoc.save();
    throw new AppError("Token expired", 401);
  }

  const existingUser = await User.findOne({
    "providers.telegram.id": telegramId,
  });
  if (
    existingUser &&
    existingUser._id.toString() !== tokenDoc.userId.toString()
  ) {
    tokenDoc.status = "failed";
    tokenDoc.failReason = "Akun Telegram ini sudah terhubung ke akun lain.";
    await tokenDoc.save();
    throw new AppError("Akun Telegram ini sudah terhubung ke akun lain.", 409);
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.providers?.telegram?.id) {
    tokenDoc.status = "failed";
    tokenDoc.failReason = "Akun Telegram sudah terhubung ke akun ini.";
    await tokenDoc.save();
    throw new AppError("Akun Telegram sudah terhubung ke akun ini.", 400);
  }

  user.providers.telegram = { id: telegramId, username: username || null };
  if (!user.firstName && firstName) user.firstName = firstName;
  if (!user.lastName && lastName) user.lastName = lastName;
  await user.save();

  tokenDoc.status = "used";
  tokenDoc.telegramId = telegramId;
  await tokenDoc.save();

  return { message: "Telegram linked successfully", username: user.username };
};

module.exports = { confirmLoginService, confirmLinkTelegramService };
