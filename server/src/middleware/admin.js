const AppError = require("../utils/apiError");

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(AppError.forbidden("Admin access required"));
  }
  next();
};

module.exports = { requireAdmin };
