const bot = require("../bot/telegram-bot");

const handleWebhook = (req, res) => {
  const secret = req.headers["x-telegram-bot-api-secret-token"];
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || secret !== expected) {
    return res.status(403).json({ error: "Forbidden" });
  }
  bot.processUpdate(req.body);

  res.sendStatus(200);
};

module.exports = { handleWebhook };
