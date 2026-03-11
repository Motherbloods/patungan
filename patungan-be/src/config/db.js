const mongoose = require("mongoose");
const logger = require("../utils/logger");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
