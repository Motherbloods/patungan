const winston = require("winston");
const fs = require("node:fs");

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const fileOptions = { maxsize: 5 * 1024 * 1024, maxFiles: 3, tailable: true };

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      ...fileOptions,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      ...fileOptions,
    }),
  ],
});

module.exports = logger;
