const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const musicSchema = new Schema(
  {
    title: String,
    image: String,
    src: String,
    color: String,
    // artists: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Users",
    //   },
    // ],
  },
  {
    collection: "song",
  }
);

const Song = mongoose.model(musicSchema.options.collection, musicSchema); //table

module.exports = Song;
