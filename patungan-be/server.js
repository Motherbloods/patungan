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

const pollingPaths = new Set([
  "/api/v1/auth/verify-login",
  "/api/v1/auth/link/telegram/verify",
]);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.path === "/health" ||
    req.path === "/api/v1/webhook" ||
    pollingPaths.has(req.path),
});
const pollingLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use([...pollingPaths], pollingLimiter);

app.use(
  cors({
    origin: process.env.FRONTENDURL || false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: process.env.CORS_CREDENTIALS === "true",
  }),
);

app.use(requestLogger);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.post("/api/v1/webhook", handleWebhook);
app.use("/api/v1", authRoutes);
app.use("/api/v1", groupRoutes);
app.use("/api/v1", dashboardRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;
