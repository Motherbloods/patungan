const app = require("./server");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");
require("./src/bot/telegram-bot");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
