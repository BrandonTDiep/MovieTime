const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settings");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, settingController.getSetting);
// router.put("/updateProfile", settingController.updateProfile);


module.exports = router;
