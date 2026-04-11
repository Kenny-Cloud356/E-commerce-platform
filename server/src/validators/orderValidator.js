const { body } = require("express-validator");

const createOrderRules = [
  body("shippingAddress.street").notEmpty().withMessage("Street is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.state").notEmpty().withMessage("State is required"),
  body("shippingAddress.zip").notEmpty().withMessage("ZIP code is required"),
  body("shippingAddress.country").notEmpty().withMessage("Country is required"),
];

const updateStatusRules = [
  body("status")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];

module.exports = { createOrderRules, updateStatusRules };
