require("dotenv").config();
const validateEnv = require("./src/utils/env");
const logger = require("./src/utils/logger");

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${reason?.code || reason?.message}`);
});

try {
  validateEnv();
} catch (err) {
  logger.error(`Invalid configuration: ${err.message}`);
  process.exit(1);
}

const app = require("./server");
const connectDB = require("./src/config/db");
require("./src/bot/telegram-bot");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on port ${PORT}`);
    });

    const shutdown = () => {
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })
  .catch((err) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
