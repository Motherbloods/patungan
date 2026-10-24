const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const { normalizeGuestId } = require("../utils/guest");

const attachActor = (req) => {
  const token = req.cookies.auth_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.telegramId = decoded.telegramId;
      req.actor = {
        type: "user",
        userId: decoded.userId,
      };
      return;
    } catch (error) {
      throw new AppError("Unauthorized - Invalid token", 401);
    }
  }

  const guestId = normalizeGuestId(req.header("x-guest-id"));

  if (req.header("x-guest-id") && !guestId) {
    throw new AppError("Invalid guest session", 400);
  }

  if (guestId) {
    req.guestId = guestId;
    req.actor = {
      type: "guest",
      guestId,
    };
    return;
  }

  req.actor = null;
};

const authMiddleware = async (req, res, next) => {
  try {
    attachActor(req);

    if (req.actor?.type !== "user") {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(error.statusCode || 401)
      .json({ error: error.message || "Unauthorized - Invalid token" });
  }
};

const actorMiddleware = async (req, res, next) => {
  try {
    attachActor(req);

    if (!req.actor) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Missing guest session or auth token" });
    }

    next();
  } catch (error) {
    console.error("Actor middleware error:", error);
    return res
      .status(error.statusCode || 401)
      .json({ error: error.message || "Unauthorized" });
  }
};

module.exports = { authMiddleware, actorMiddleware };
