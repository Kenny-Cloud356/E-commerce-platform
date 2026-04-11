const { Router } = require("express");
const productController = require("../controllers/productController");
const { createProductRules, updateProductRules } = require("../validators/productValidator");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.get("/", productController.getAll);
router.get("/search", productController.search);
router.get("/slug/:slug", productController.getBySlug);
router.get("/:id", productController.getById);
router.post("/", authenticate, requireAdmin, createProductRules, productController.create);
router.put("/:id", authenticate, requireAdmin, updateProductRules, productController.update);
router.delete("/:id", authenticate, requireAdmin, productController.remove);

module.exports = router;
