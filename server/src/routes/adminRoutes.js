const { Router } = require("express");
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/revenue", adminController.getRevenueReport);

module.exports = router;
