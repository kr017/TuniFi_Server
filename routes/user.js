var express = require("express");
var router = express.Router();

const UserController = require("../controller/user");
const SongController = require("../controller/song");

const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");

//user apis
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/checkMail", UserController.checkMail);

router.all("/api/*", userAuthenticated, userExists);
// router.post("/api/addWishlist", WishlistController.addProductToWishlist);
router.post("/api/songs", SongController.getAllSongs);

module.exports = router;
