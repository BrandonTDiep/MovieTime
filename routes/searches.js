const express = require("express");
const router = express.Router();
const searchesController = require("../controllers/searches");

//Search Routes - simplified for now
router.get("/:username", searchesController.getSearchedUsers);


module.exports = router;
