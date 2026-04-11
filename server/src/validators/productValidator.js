const { body } = require("express-validator");

const createProductRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("description").optional().trim(),
  body("compare_price").optional().isFloat({ min: 0 }).withMessage("Compare price must be positive"),
  body("category_id").optional().isUUID().withMessage("Invalid category ID"),
  body("featured").optional().isBoolean(),
];

const updateProductRules = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("description").optional().trim(),
  body("compare_price").optional().isFloat({ min: 0 }),
  body("category_id").optional().isUUID(),
  body("featured").optional().isBoolean(),
];

module.exports = { createProductRules, updateProductRules };
