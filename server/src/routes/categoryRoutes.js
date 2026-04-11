const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", authenticate, requireAdmin, categoryController.create);
router.put("/:id", authenticate, requireAdmin, categoryController.update);
router.delete("/:id", authenticate, requireAdmin, categoryController.remove);

module.exports = router;
