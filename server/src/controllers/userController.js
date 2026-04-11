const User = require("../models/User");
const Address = require("../models/Address");
const { hashPassword, comparePassword } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");
const { buildPaginationMeta } = require("../utils/helpers");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const addresses = await Address.findByUser(req.user.id);
  res.json({ success: true, data: { ...user, addresses } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "avatar"];
  const fields = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) fields[key] = req.body[key];
  });

  const user = await User.update(req.user.id, fields);
  res.json({ success: true, data: user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw AppError.badRequest("Current and new password are required");
  }
  if (newPassword.length < 8) {
    throw AppError.badRequest("New password must be at least 8 characters");
  }

  const user = await User.findByEmail(req.user.email);
  const isMatch = await comparePassword(currentPassword, user.password_hash);
  if (!isMatch) throw AppError.unauthorized("Current password is incorrect");

  const password_hash = await hashPassword(newPassword);
  await User.update(req.user.id, { password_hash });

  res.json({ success: true, message: "Password changed successfully" });
});

// Admin: get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { users, total } = await User.findAll({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json({
    success: true,
    data: users,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

// Admin: toggle user active status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw AppError.notFound("User not found");

  const updated = await User.update(req.params.id, { is_active: !user.is_active });
  res.json({ success: true, data: updated });
});

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, toggleUserStatus };
