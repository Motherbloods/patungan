const TelegramBot = require("node-telegram-bot-api");
const messages = require("../utils/messages");
const {
  confirmLoginService,
  confirmLinkTelegramService,
} = require("../services/telegram.service");

const token = process.env.TOKEN;
if (!token) console.error("❌ TELEGRAM TOKEN NOT FOUND");

const bot = new TelegramBot(token, { polling: false });

const send = (chatId, text) =>
  bot.sendMessage(chatId, text).catch((err) => {
    console.error("Telegram send failed:", err.code || err.message);
  });

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1].trim();
  if (!param) {
    return send(chatId, messages.welcome);
  }

  if (param.startsWith("link_")) {
    const linkToken = param.slice(5);

    if (!uuidRegex.test(linkToken)) {
      return send(chatId, messages.invalidLink);
    }

    try {
      await confirmLinkTelegramService({
        linkToken,
        telegramId: msg.from.id.toString(),
        username: msg.from.username || "",
        firstName: msg.from.first_name || "",
        lastName: msg.from.last_name || "",
      });
      return send(chatId, messages.linkSuccess);
    } catch (error) {
      console.error("❌ Link telegram error:", error);
      const errorMessages = {
        "Token expired": messages.tokenExpired,
        "Token already used": messages.tokenUsed,
        "Invalid token": messages.invalidLink,
        "Akun Telegram ini sudah terhubung ke akun lain.":
          messages.alreadyLinkedOther,
        "Akun Telegram sudah terhubung ke akun ini.":
          messages.alreadyLinkedSelf,
      };
      return send(
        chatId,
        errorMessages[error.message] || messages.generalError,
      );
    }
  }

  if (!uuidRegex.test(param)) {
    return send(chatId, messages.invalidLink);
  }

  try {
    await confirmLoginService({
      telegramId: msg.from.id.toString(),
      username: msg.from.username || "",
      firstName: msg.from.first_name || "",
      lastName: msg.from.last_name || "",
      loginToken: param,
    });
    return send(chatId, messages.loginSuccess);
  } catch (error) {
    console.error("❌ Bot login error:", error);
    const errorMessages = {
      "Token expired": messages.tokenExpired,
      "Token already used": messages.tokenUsed,
      "Invalid token": messages.invalidLink,
    };
    return send(
      chatId,
      errorMessages[error.message] || messages.generalError,
    );
  }
});

module.exports = bot;
