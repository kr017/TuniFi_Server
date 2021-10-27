const Song = require("../models/song");
const User = require("../models/user");

const moment = require("moment");
const LikedSongs = require("../models/liked");
const Playlist = require("../models/playlist");

module.exports = {
  getAllSongs: async (req, res) => {
    try {
      let sort = {};
      if (req.body.order) {
        sort[req.body.field] = parseInt(req.body.order); //order=1  =>ASC
        // sort["title"]=1 //sorting by title in ASC order
      } else {
        sort.created_at = -1;
      }
      let search = {};

      if (req.body.title) {
        search.title = new RegExp(req.body.title, "i");
      }

      let songs = await Song.find(search)
        .collation({ locale: "en_US", strength: 1 }) //letter casing
        .sort(sort);

      res.json({
        status: "success",
        message: "all songs",
        data: songs,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
  getSongDetails: async (req, res) => {
    try {
      if (!req.body.song_id) {
        throw { message: "Song id is required." };
      }
      let song = await Song.findById(req.body.song_id);

      res.json({
        status: "success",
        message: "Song",
        data: song,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to find song",
      });
    }
  },
  likeSong: async (req, res) => {
    try {
      let updatedPlaylist = await LikedSongs.findOneAndUpdate(
        { userId: req.user._id },
        {
          $push: {
            songs: req.body._id,
          },
          modifiedOn: moment().unix() * 1000,
        },
        {
          new: true,
          upsert: true,
        }
      ).populate("songs");
      return res.json({
        status: "success",
        message: "updated successfully",
        data: updatedPlaylist,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },
  unlikeSong: async (req, res) => {
    try {
      let updatedPlaylist = await LikedSongs.findOneAndUpdate(
        { userId: req.user._id },
        {
          $pull: {
            songs: req.body._id,
          },
          modifiedOn: moment().unix() * 1000,
        },
        {
          new: true,
          upsert: true,
        }
      ).populate("songs");
      return res.json({
        status: "success",
        message: "updated successfully",
        data: updatedPlaylist,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get details",
      });
    }
  },
  getLikedSongs: async (req, res) => {
    try {
      let userId = req.user._id;
      let liked = await LikedSongs.findOne({ userId });

      if (liked) {
        let songs = liked.songs;
        let likedList = [];

        for (let i = 0; i < songs.length; i++) {
          const song = await Song.findById(songs[i]._id);
          likedList.push(song);
        }
        liked = {
          _id: liked._id,
          modifiedOn: liked.modifiedOn,
          songs: likedList,
          userId: liked.userId,
        };
      }
      res.json({
        status: "success",
        message: "User Liked Songs",
        data: liked,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get songs",
      });
    }
  },

  // <-----------Playlist-------------------->
  createPlaylist: (req, res) => {
    if (!req.body.name) {
      return res.status(400).json({
        msg: "Playlist name is required",
      });
    }

    req.body.userId = req.user._id;
    if (req.body.song) {
      req.body.songs = [req.body.song];
    }

    const playlist = new Playlist(req.body);
    playlist.save((err, data) => {
      if (err) {
        return res.status(400).json({
          msg: "Failed to create playlist",
        });
      } else {
        res.json({
          status: "success",
          msg: "Playlist created!!!",
          data: data,
        });
      }
    });
  },

  addSongToPlaylist: async (req, res) => {
    try {
      let { playlist_id, song_id } = req.body;

      if (!song_id || !playlist_id) {
        return res.status(400).json({
          msg: "Playlist and song are required",
        });
      }

      let playlist = await Playlist.findOne({ _id: playlist_id });
      if (playlist.songs.some(s => s._id === song_id)) {
        return res.status(401).json({
          msg: "Song already exists in playlist",
        });
      }

      let updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlist_id },
        {
          $push: {
            songs: song_id,
          },
        },
        {
          new: true,
        }
      ).populate("songs");

      res.json({
        status: "success",
        message: "updated successfully",
        data: updatedPlaylist,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },

  removeSongFromPlaylist: async (req, res) => {
    try {
      let userId = req.user._id;
      let { playlist_id, song_id } = req.body;

      if (!song_id || !playlist_id) {
        return res.status(400).json({
          msg: "Playlist and song are required",
        });
      }

      let updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlist_id },
        {
          $pull: {
            songs: song_id,
          },
        },
        {
          new: true,
        }
      ).populate("songs");

      res.json({
        status: "success",
        message: "updated successfully",
        data: updatedPlaylist,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },

  deletePlaylist: async (req, res) => {
    try {
      if (!req.body.playlist_id) {
        throw { message: "id is required." };
      }

      let deletePlay = await Playlist.findByIdAndDelete(req.body.playlist_id);
      res.json({
        status: "success",
        message: "deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || " update failed",
      });
    }
  },

  getPlaylistDetails: async (req, res) => {
    try {
      if (!req.body.playlist_id) {
        throw { message: "id is required." };
      }

      let playlist = await Playlist.findById(req.body.playlist_id).populate(
        "songs"
      );

      res.json({
        status: "success",
        message: "playlist details",
        data: playlist,
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "failed to fetch details",
      });
    }
  },
  getAllPlaylist: async (req, res) => {
    try {
      let userId = req.user._id;
      let playlists = await Playlist.find({ userId: userId });

      res.json({
        status: "success",
        msg: "all playlists!!!",
        data: playlists,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get playlists",
      });
    }
  },
};
