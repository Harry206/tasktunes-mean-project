// models/playlist.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  url: String
});

const playlistSchema = new mongoose.Schema({
  task: String,
  mood: String,
  songs: [songSchema] // array of songs
});

module.exports = mongoose.model('Playlist', playlistSchema);
