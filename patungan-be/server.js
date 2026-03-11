require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTENDURL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: process.env.CORS_CREDENTIALS,
  }),
);

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// routes utama
// app.use("/api/v1", require("./src/routes"));

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
