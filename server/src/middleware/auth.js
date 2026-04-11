const { verifyAccessToken } = require("../services/authService");
const AppError = require("../utils/apiError");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.is_active) {
      throw AppError.unauthorized("User not found or deactivated");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(AppError.unauthorized("Invalid or expired token"));
    }
    next(err);
  }
};

module.exports = { authenticate };
