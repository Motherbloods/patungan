const LoginToken = require("../models/login-token");
const User = require("../models/user");

const confirmLoginService = async ({
  loginToken,
  telegramId,
  username,
  firstName,
  lastName,
}) => {
  if (!loginToken || !telegramId) {
    throw { status: 400, message: "Login token and Telegram ID required" };
  }

  const tokenDoc = await LoginToken.findOne({ token: loginToken });
  if (!tokenDoc) {
    throw { status: 404, message: "Invalid token" };
  }

  if (tokenDoc.status !== "pending") {
    throw { status: 400, message: "Token already used" };
  }

  if (tokenDoc.expiresAt < new Date()) {
    tokenDoc.status = "expired";
    await tokenDoc.save();
    throw { status: 401, message: "Token expired" };
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

module.exports = { confirmLoginService };
