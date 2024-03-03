const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profiles");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Profile Routes - simplified for now
router.get("/:id", ensureAuth, profileController.getProfile);
// router.put("/updateProfile/:id", profileController.updateReview);
// router.delete("/deleteProfile/:id", profileController.deletePost);



module.exports = router;
