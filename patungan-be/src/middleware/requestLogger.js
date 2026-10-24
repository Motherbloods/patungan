const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
};

module.exports = requestLogger;
