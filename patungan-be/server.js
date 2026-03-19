require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");
const AppError = require("./src/errors/AppError");

const groupRoutes = require("./src/routes/group.route");
const dashboardRoutes = require("./src/routes/dashboard.route");
const authRoutes = require("./src/routes/auth.route");
const { handleWebhook } = require("./src/controllers/telegram.controller");

const app = express();
app.set("trust proxy", 1);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // max 100 request per IP
});
app.use(limiter);

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
app.post("/api/v1/webhook", handleWebhook);
app.use("/api/v1", authRoutes);
app.use("/api/v1", groupRoutes);
app.use("/api/v1", dashboardRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;
