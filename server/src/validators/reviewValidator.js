const { body } = require("express-validator");

const createReviewRules = [
  body("product_id").isUUID().withMessage("Valid product ID is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("comment").optional().trim().isLength({ max: 1000 }).withMessage("Comment max 1000 characters"),
];

const updateReviewRules = [
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("comment").optional().trim().isLength({ max: 1000 }).withMessage("Comment max 1000 characters"),
];

module.exports = { createReviewRules, updateReviewRules };
