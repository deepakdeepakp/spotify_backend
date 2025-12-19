const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  duration: { type: String, required: true },
  image: { type: String, default: '' },
  audioUrl: { type: String, required: true },
  genre: { type: String, default: '' },
  playCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});   

module.exports = mongoose.model('Song', songSchema);
