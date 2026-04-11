const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");
const { slugify } = require("../utils/helpers");

const getAll = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.json({ success: true, data: categories });
});

const getById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw AppError.notFound("Category not found");
  res.json({ success: true, data: category });
});

const create = asyncHandler(async (req, res) => {
  const { name, description, image, parent_id } = req.body;
  if (!name) throw AppError.badRequest("Category name is required");

  const slug = slugify(name);
  const category = await Category.create({ name, slug, description, image, parent_id });
  res.status(201).json({ success: true, data: category });
});

const update = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);
  if (!existing) throw AppError.notFound("Category not found");

  const fields = { ...req.body };
  if (fields.name) fields.slug = slugify(fields.name);

  const category = await Category.update(req.params.id, fields);
  res.json({ success: true, data: category });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);
  if (!existing) throw AppError.notFound("Category not found");

  await Category.delete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
});

module.exports = { getAll, getById, create, update, remove };
