const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");
const { slugify, buildPaginationMeta } = require("../utils/helpers");

const getAll = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, minPrice, maxPrice, sort, featured } = req.query;
  const { products, total } = await Product.findAll({
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    minPrice,
    maxPrice,
    sort,
    featured: featured === "true",
  });

  res.json({
    success: true,
    data: products,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

const getById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw AppError.notFound("Product not found");
  res.json({ success: true, data: product });
});

const getBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findBySlug(req.params.slug);
  if (!product) throw AppError.notFound("Product not found");
  res.json({ success: true, data: product });
});

const search = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;
  if (!q) throw AppError.badRequest("Search query is required");

  const { products, total } = await Product.search(q, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json({
    success: true,
    data: products,
    pagination: buildPaginationMeta(total, parseInt(page), parseInt(limit)),
  });
});

const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const slug = slugify(req.body.name);
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: product });
});

const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw AppError.badRequest(errors.array()[0].msg);

  const existing = await Product.findById(req.params.id);
  if (!existing) throw AppError.notFound("Product not found");

  const fields = { ...req.body };
  if (fields.name) fields.slug = slugify(fields.name);

  const product = await Product.update(req.params.id, fields);
  res.json({ success: true, data: product });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) throw AppError.notFound("Product not found");

  await Product.delete(req.params.id);
  res.json({ success: true, message: "Product deleted" });
});

module.exports = { getAll, getById, getBySlug, search, create, update, remove };
