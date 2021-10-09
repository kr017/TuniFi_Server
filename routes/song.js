var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const SongController = require("../controller/song");

// router.post("/shop", ProductController.getAllProducts);
// router.get("/shop/:id", ProductController.getProductDetails);
// router.post("/filters", ProductController.getFiltersList);

router.post("/song", SongController.getAllSongs);
module.exports = router;
