const express = require("express");
const {
  verifyAuth,
  requestLogin,
  loginGoogle,
  verifyLoginToken,
  logout,
  linkGoogle,
  requestLinkTelegram,
  verifyLinkToken,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/auth/verify", authMiddleware, verifyAuth);
router.post("/auth/request-login", requestLogin);
router.post("/auth/link/telegram/request", authMiddleware, requestLinkTelegram);
router.post("/auth/link/telegram/verify", authMiddleware, verifyLinkToken);
router.post("/auth/login/google", loginGoogle);
router.post("/auth//link/google", authMiddleware, linkGoogle);
router.post("/auth/verify-login", verifyLoginToken);
router.post("/auth/logout", logout);

module.exports = router;
