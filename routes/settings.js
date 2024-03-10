const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const settingController = require("../controllers/settings");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, settingController.getSetting);
router.put("/updateSetting", upload.single("file"), settingController.updateSetting);


module.exports = router;
