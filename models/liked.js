const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const likedSongSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    songs: [{ type: Schema.Types.ObjectId, ref: "song" }],
    modifiedOn: {
      type: Date,
    },
  },
  { collection: "liked" }
);

likedSongSchema.pre("save", function (next) {
  const liked = this;
  liked.modifiedOn = moment().unix() * 1000;

  next();
});

const LikedSongs = mongoose.model(
  likedSongSchema.options.collection,
  likedSongSchema
); //table

module.exports = LikedSongs;
