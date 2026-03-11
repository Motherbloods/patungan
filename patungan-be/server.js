require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");
const AppError = require("./src/errors/AppError");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTENDURL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: process.env.CORS_CREDENTIALS === "true",
  }),
);

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// routes utama
// app.use("/api/v1", require("./src/routes"));

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;
