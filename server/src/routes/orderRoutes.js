const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { createOrderRules, updateStatusRules } = require("../validators/orderValidator");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.use(authenticate);

router.post("/", createOrderRules, orderController.createOrder);
router.get("/my-orders", orderController.getMyOrders);
router.get("/all", requireAdmin, orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", requireAdmin, updateStatusRules, orderController.updateStatus);

module.exports = router;
