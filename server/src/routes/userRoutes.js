const { Router } = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/change-password", userController.changePassword);

// Admin routes
router.get("/", requireAdmin, userController.getAllUsers);
router.put("/:id/toggle-status", requireAdmin, userController.toggleUserStatus);

module.exports = router;
