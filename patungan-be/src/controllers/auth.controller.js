const asyncHandler = require("../utils/asyncHandler");
const {
  requestLoginService,
  verifyLoginTokenService,
  verifyAuthService,
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
  res.json([]);
});

const logout = asyncHandler(async (req, res) => {
  res.json([]);
});

module.exports = {
  verifyAuth,
  requestLogin,
  loginGoogle,
  verifyLoginToken,
  logout,
};
