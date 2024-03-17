const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const settingController = require("../controllers/settings");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Settings Routes - simplified for now
router.get("/", ensureAuth, settingController.getSetting);
router.put("/updateSetting", upload.single("file"), settingController.updateSetting);
router.put("/updateFavMovies",  settingController.updateFavMovies);


module.exports = router;
