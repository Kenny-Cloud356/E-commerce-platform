const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");

const getCart = asyncHandler(async (req, res) => {
  const data = await Cart.getCartWithItems(req.user.id);
  res.json({ success: true, data });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) throw AppError.badRequest("Product ID is required");

  const product = await Product.findById(productId);
  if (!product) throw AppError.notFound("Product not found");
  if (product.stock < quantity) throw AppError.badRequest("Insufficient stock");

  await Cart.addItem(req.user.id, productId, quantity);
  const data = await Cart.getCartWithItems(req.user.id);
  res.json({ success: true, data });
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw AppError.badRequest("Quantity must be at least 1");

  const item = await Cart.updateQuantity(req.user.id, req.params.itemId, quantity);
  if (!item) throw AppError.notFound("Cart item not found");

  const data = await Cart.getCartWithItems(req.user.id);
  res.json({ success: true, data });
});

const removeItem = asyncHandler(async (req, res) => {
  await Cart.removeItem(req.user.id, req.params.itemId);
  const data = await Cart.getCartWithItems(req.user.id);
  res.json({ success: true, data });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.clear(req.user.id);
  res.json({ success: true, data: { items: [], total: 0 } });
});

module.exports = { getCart, addItem, updateQuantity, removeItem, clearCart };
