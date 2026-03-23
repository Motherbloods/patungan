const asyncHandler = require("../utils/asyncHandler");
const {
  requestLoginService,
  verifyLoginTokenService,
  verifyAuthService,
  loginWithGoogleService,
  linkGoogleService,
  requestLinkTelegramService,
  verifyLinkTokenService,
} = require("../services/auth.service");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(process.env.NODE_ENV === "production" && {
    domain: ".motherbloodss.site",
  }),
};

const requestLogin = asyncHandler(async (req, res) => {
  const result = await requestLoginService();
  return res.json(result);
});

const verifyLoginToken = asyncHandler(async (req, res) => {
  const { loginToken } = req.body;
  const result = await verifyLoginTokenService(loginToken);

  if (result.status === "pending") {
    return res.json(result);
  }

  res.cookie("auth_token", result.jwtToken, cookieOptions);

  return res.json({ isAuthenticated: true, user: result.user });
});

const verifyAuth = asyncHandler(async (req, res) => {
  const user = await verifyAuthService(req.userId);
  return res.status(200).json({ user });
});

const loginGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: "Google ID token is required",
    });
  }

  const { user, token } = await loginWithGoogleService(idToken);

  res.cookie("auth_token", token, cookieOptions);

  return res.status(200).json({
    success: true,
    user,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("auth_token", cookieOptions);
  return res.status(200).json({ message: "Logout successful" });
});

const linkGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken)
    return res.status(400).json({ error: "Google ID token is required" });

  const user = await linkGoogleService(req.userId, idToken);
  return res.status(200).json({ success: true, user });
});

const requestLinkTelegram = asyncHandler(async (req, res) => {
  const data = await requestLinkTelegramService(req.userId);

  return res.status(200).json(data);
});

const verifyLinkToken = asyncHandler(async (req, res) => {
  const { linkToken } = req.body;
  if (!linkToken) return res.status(400).json({ error: "Link token required" });

  const result = await verifyLinkTokenService(linkToken, req.userId);

  if (result.status === "pending") return res.status(202).json(result);
  return res.status(200).json(result);
});
module.exports = {
  verifyAuth,
  requestLogin,
  loginGoogle,
  linkGoogle,
  verifyLoginToken,
  logout,
  requestLinkTelegram,
  verifyLinkToken,
};
