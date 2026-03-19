const express = require("express");
const {
  verifyAuth,
  requestLogin,
  loginGoogle,
  verifyLoginToken,
  logout,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/auth/verify", authMiddleware, verifyAuth);
router.post("/auth/request-login", requestLogin);
router.post("/auth/login/google", loginGoogle);
router.post("/auth/verify-login", verifyLoginToken);
router.post("/auth/logout", logout);

module.exports = router;
