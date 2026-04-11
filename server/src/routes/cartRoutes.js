const { Router } = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", cartController.addItem);
router.put("/:itemId", cartController.updateQuantity);
router.delete("/clear", cartController.clearCart);
router.delete("/:itemId", cartController.removeItem);

module.exports = router;
