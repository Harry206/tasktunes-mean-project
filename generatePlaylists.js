// generatePlaylists.js
require('dotenv').config(); // load .env
const mongoose = require('mongoose');
const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('./models/playlist');

// ====== 1. Connect MongoDB ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB connection failed ❌', err));

// ====== 2. Spotify Setup ======
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Get access token
async function authorizeSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify Authenticated ✅');
  } catch (err) {
    console.error('Spotify Authentication failed ❌', err.message);
  }
}

// ====== 3. Tasks & Moods ======
const tasks = ['Workout', 'Study', 'Relax', 'Party', 'Sleep'];
const moods = ['Energetic', 'Focused', 'Calm', 'Happy', 'Sad'];

// ====== 4. Fetch songs from Spotify ======
async function fetchSongs(task, mood, limit = 25) {
  try {
    const offset = Math.floor(Math.random() * 50); // random offset
    const result = await spotifyApi.searchTracks(`${task} ${mood}`, { limit, offset });
    return result.body.tracks.items.map(track => ({
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify
    }));
  } catch (err) {
    console.error(`Failed for ${task} - ${mood}:`, err.message);
    return [];
  }
}

// ====== 5. Append songs without duplicates ======
async function appendSongs() {
  await authorizeSpotify();

  for (const task of tasks) {
    for (const mood of moods) {
      console.log(`Fetching new songs for ${task} - ${mood}...`);
      const newSongs = await fetchSongs(task, mood);

      if (!newSongs.length) continue;

      let playlist = await Playlist.findOne({ task, mood });
      if (!playlist) {
        playlist = new Playlist({ task, mood, songs: [] });
      }

      const existingSet = new Set(playlist.songs.map(s => `${s.title}-${s.artist}`));
      const uniqueSongs = newSongs.filter(s => !existingSet.has(`${s.title}-${s.artist}`));

      const spaceLeft = 50 - playlist.songs.length;
      playlist.songs.push(...uniqueSongs.slice(0, spaceLeft));

      await playlist.save();
      console.log(`Appended ${uniqueSongs.slice(0, spaceLeft).length} new songs to ${task} - ${mood}`);
    }
  }

  console.log('All playlists updated ✅');
  mongoose.disconnect();
}

// Run the script
appendSongs().catch(err => console.error(err));
