const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = Router();

router.use(authenticate, requireAdmin);

router.post("/image", upload.single("image"), uploadController.uploadSingle);
router.post("/images", upload.array("images", 10), uploadController.uploadMultiple);

module.exports = router;
