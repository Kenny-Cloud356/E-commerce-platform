const { validationResult } = require("express-validator");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");
const { buildPaginationMeta } = require("../utils/helpers");

const getByProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { reviews, total } = await Review.findByProduct(req.params.productId, {
    page: parseInt(page),
    limit: parseInt(limit),
  });
  res.json({
    success: true,
    data: reviews,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const existing = await Review.findByUserAndProduct(req.user.id, req.body.product_id);
  if (existing) throw AppError.conflict("You have already reviewed this product");

  const review = await Review.create({
    user_id: req.user.id,
    product_id: req.body.product_id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({ success: true, data: review });
});

const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const review = await Review.findById(req.params.id);
  if (!review) throw AppError.notFound("Review not found");
  if (review.user_id !== req.user.id) throw AppError.forbidden("Not your review");

  const updated = await Review.update(req.params.id, req.body);
  res.json({ success: true, data: updated });
});

const remove = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw AppError.notFound("Review not found");
  if (review.user_id !== req.user.id && req.user.role !== "admin") {
    throw AppError.forbidden("Not authorized");
  }

  await Review.delete(req.params.id);
  res.json({ success: true, message: "Review deleted" });
});

module.exports = { getByProduct, create, update, remove };
