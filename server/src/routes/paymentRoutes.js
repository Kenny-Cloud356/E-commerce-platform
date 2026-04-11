const { Router } = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.post("/create-intent", authenticate, paymentController.createPaymentIntent);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
