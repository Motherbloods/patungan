const bot = require("../bot/telegram-bot");

const handleWebhook = (req, res) => {
  const secret = req.headers["x-telegram-bot-api-secret-token"];
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  bot.processUpdate(req.body);

  res.sendStatus(200);
};

module.exports = { handleWebhook };
