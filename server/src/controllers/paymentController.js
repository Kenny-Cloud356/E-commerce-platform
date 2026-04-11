const paymentService = require("../services/paymentService");
const Order = require("../models/Order");
const emailService = require("../services/emailService");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../config/logger");

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await paymentService.createPaymentIntent(amount, {
    userId: req.user.id,
  });

  res.json({
    success: true,
    data: { clientSecret: paymentIntent.client_secret },
  });
});

const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = paymentService.constructWebhookEvent(req.body, signature);
  } catch (err) {
    logger.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const order = await Order.updatePaymentStatus(paymentIntent.id, "paid");
      if (order) {
        await Order.updateStatus(order.id, "processing");
        const user = await User.findById(order.user_id);
        if (user) emailService.sendOrderConfirmation(user, order);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      await Order.updatePaymentStatus(paymentIntent.id, "failed");
      break;
    }
    default:
      logger.info(`Unhandled webhook event: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = { createPaymentIntent, handleWebhook };
