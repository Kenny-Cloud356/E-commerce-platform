const { validationResult } = require("express-validator");
const { pool } = require("../config/database");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const paymentService = require("../services/paymentService");
const emailService = require("../services/emailService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");
const { buildPaginationMeta } = require("../utils/helpers");

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const { shippingAddress } = req.body;
  const cartData = await Cart.getCartWithItems(req.user.id);

  if (cartData.items.length === 0) {
    throw AppError.badRequest("Cart is empty");
  }

  // Verify stock availability
  for (const item of cartData.items) {
    if (item.stock < item.quantity) {
      throw AppError.badRequest(`Insufficient stock for ${item.name}`);
    }
  }

  // Create Stripe payment intent
  const paymentIntent = await paymentService.createPaymentIntent(cartData.total, {
    userId: req.user.id,
  });

  // Create order
  const order = await Order.create({
    user_id: req.user.id,
    total: cartData.total,
    shipping_address: shippingAddress,
    payment_intent_id: paymentIntent.id,
  });

  // Create order items and reduce stock
  const orderItems = cartData.items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));
  await OrderItem.createBulk(order.id, orderItems);

  // Reduce product stock
  for (const item of cartData.items) {
    await pool.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2",
      [item.quantity, item.product_id]
    );
  }

  // Clear cart
  await Cart.clear(req.user.id);

  res.status(201).json({
    success: true,
    data: {
      order,
      clientSecret: paymentIntent.client_secret,
    },
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { orders, total } = await Order.findByUser(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json({
    success: true,
    data: orders,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw AppError.notFound("Order not found");

  // Only allow owner or admin
  if (order.user_id !== req.user.id && req.user.role !== "admin") {
    throw AppError.forbidden("Access denied");
  }

  const items = await OrderItem.findByOrder(order.id);
  res.json({ success: true, data: { ...order, items } });
});

const updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const order = await Order.updateStatus(req.params.id, req.body.status);
  if (!order) throw AppError.notFound("Order not found");

  res.json({ success: true, data: order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const { orders, total } = await Order.findAll({
    page: parseInt(page),
    limit: parseInt(limit),
    status,
  });

  res.json({
    success: true,
    data: orders,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

module.exports = { createOrder, getMyOrders, getOrderById, updateStatus, getAllOrders };
