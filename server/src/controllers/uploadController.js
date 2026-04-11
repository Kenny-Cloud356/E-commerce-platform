const { uploadImage } = require("../services/uploadService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/apiError");

const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw AppError.badRequest("No image file provided");

  const imageUrl = await uploadImage(req.file, req.query.folder || "products");
  res.json({ success: true, data: { url: imageUrl } });
});

const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw AppError.badRequest("No image files provided");
  }

  const folder = req.query.folder || "products";
  const urls = await Promise.all(
    req.files.map((file) => uploadImage(file, folder))
  );

  res.json({ success: true, data: { urls } });
});

module.exports = { uploadSingle, uploadMultiple };
