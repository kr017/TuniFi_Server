const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const PlaylistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    modifiedOn: {
      type: Date,
    },
  },
  { collection: "playlist" }
);

PlaylistSchema.pre("save", function (next) {
  const liked = this;
  liked.modifiedOn = moment().unix() * 1000;

  next();
});

const Playlist = mongoose.model(
  PlaylistSchema.options.collection,
  PlaylistSchema
); //table

module.exports = Playlist;
