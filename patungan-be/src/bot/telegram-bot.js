const TelegramBot = require("node-telegram-bot-api");
const messages = require("../utils/messages");
const { confirmLoginService } = require("../services/telegram.service");

const token = process.env.TOKEN;
if (!token) console.error("❌ TELEGRAM TOKEN NOT FOUND");

const bot = new TelegramBot(token, { polling: false });

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1].trim();
  if (!param) {
    return bot.sendMessage(chatId, messages.welcome);
  }

  if (!uuidRegex.test(param)) {
    return bot.sendMessage(chatId, messages.invalidLink);
  }

  try {
    await confirmLoginService({
      telegramId: msg.from.id.toString(),
      username: msg.from.username || "",
      firstName: msg.from.first_name || "",
      lastName: msg.from.last_name || "",
      loginToken: param,
    });
    return bot.sendMessage(chatId, messages.loginSuccess);
  } catch (error) {
    console.error("❌ Bot login error:", error);
    const errorMessages = {
      "Token expired": messages.tokenExpired,
      "Token already used": messages.tokenUsed,
      "Invalid token": messages.invalidLink,
    };
    return bot.sendMessage(
      chatId,
      errorMessages[error.message] || messages.generalError,
    );
  }
});

module.exports = bot;
