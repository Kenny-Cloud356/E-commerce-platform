const { Router } = require("express");
const authController = require("../controllers/authController");
const { registerRules, loginRules, forgotPasswordRules, resetPasswordRules } = require("../validators/authValidator");

const router = Router();

router.post("/register", registerRules, authController.register);
router.post("/login", loginRules, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", forgotPasswordRules, authController.forgotPassword);
router.post("/reset-password", resetPasswordRules, authController.resetPassword);

module.exports = router;
