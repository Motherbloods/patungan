const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const candidate = err.statusCode || err.status;
  const statusCode = Number.isInteger(candidate) && candidate >= 400 && candidate < 600 ? candidate : 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  if (!isClientError) {
    logger.error(
      `${req.method} ${req.path} - ${err.stack || err.message}`.replace(/[\r\n\u2028\u2029]+/g, " | "),
    );
  }

  res.status(statusCode).json({
    status: isClientError ? "fail" : "error",
    message: isClientError || err.isOperational ? err.message : "Internal Server Error",
  });
};

module.exports = errorHandler;
