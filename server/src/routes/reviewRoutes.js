const { Router } = require("express");
const reviewController = require("../controllers/reviewController");
const { createReviewRules, updateReviewRules } = require("../validators/reviewValidator");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.get("/product/:productId", reviewController.getByProduct);
router.post("/", authenticate, createReviewRules, reviewController.create);
router.put("/:id", authenticate, updateReviewRules, reviewController.update);
router.delete("/:id", authenticate, reviewController.remove);

module.exports = router;
