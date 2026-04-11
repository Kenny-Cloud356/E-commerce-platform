const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const authService = require("../services/authService");
const emailService = require("../services/emailService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.badRequest(errors.array()[0].msg);
  }

  const { name, email, password } = req.body;

  const existing = await User.findByEmail(email);
  if (existing) {
    throw AppError.conflict("Email already registered");
  }

  const password_hash = await authService.hashPassword(password);
  const user = await User.create({ name, email, password_hash });

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  emailService.sendWelcome(user);

  res.status(201).json({
    success: true,
    data: { user, accessToken, refreshToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.badRequest(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  if (!user.is_active) {
    throw AppError.forbidden("Account has been deactivated");
  }

  const isMatch = await authService.comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    throw AppError.badRequest("Refresh token is required");
  }

  const decoded = authService.verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw AppError.unauthorized("User not found");
  }

  const accessToken = authService.generateAccessToken(user);
  const newRefreshToken = authService.generateRefreshToken(user);

  res.json({
    success: true,
    data: { accessToken, refreshToken: newRefreshToken },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.badRequest(errors.array()[0].msg);
  }

  const { email } = req.body;
  const { token, hash, expires } = authService.generateResetToken();

  const user = await User.setResetToken(email, hash, expires);

  if (user) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const fullUser = await User.findByEmail(email);
    await emailService.sendPasswordReset(fullUser, resetUrl);
  }

  // Always respond with success to avoid email enumeration
  res.json({
    success: true,
    message: "If that email exists, a reset link has been sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.badRequest(errors.array()[0].msg);
  }

  const { token, password } = req.body;
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findByResetToken(hash);
  if (!user) {
    throw AppError.badRequest("Invalid or expired reset token");
  }

  const password_hash = await authService.hashPassword(password);
  await User.update(user.id, {
    password_hash,
    reset_token: null,
    reset_token_expires: null,
  });

  res.json({ success: true, message: "Password reset successful" });
});

module.exports = { register, login, refreshToken, forgotPassword, resetPassword };
