var express = require("express");
var router = express.Router();

const UserController = require("../controller/user");
const SongController = require("../controller/song");
const LikedController = require("../controller/wishlist");

const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");

//user apis
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/checkMail", UserController.checkMail);

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/songs", SongController.getAllSongs);
router.post("/api/songDetails", SongController.getSongDetails);

router.post("/api/addLiked", SongController.likeSong);
router.post("/api/removeLiked", SongController.unlikeSong);
router.get("/api/likedSongs", SongController.getLikedSongs);

// <-----------Playlist----------->
router.post("/api/createPlay", SongController.createPlaylist);
router.get("/api/getPlaylists", SongController.getAllPlaylist);

router.post("/api/addToPlaylist", SongController.addSongToPlaylist);
router.post("/api/removeFromPlaylist", SongController.removeSongFromPlaylist);
router.post("/api/deletePlaylist", SongController.deletePlaylist);

router.post("/api/playlistDetails", SongController.getPlaylistDetails);

// router.get("/api/wishlist", WishlistController.getProductsFromWishlist);
// router.post(
//   "/api/removeWishlist",
//   WishlistController.removeProductFromWishlist
// );

module.exports = router;
