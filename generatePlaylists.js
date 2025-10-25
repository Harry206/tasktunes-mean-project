// generatePlaylists.js
const mongoose = require('mongoose');
const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('./models/playlist');

// ====== 1. Connect MongoDB ======
mongoose.connect('mongodb+srv://tasktunesUser:tasktunesdatabasepassword91@tasktunescluster.ei2i8u3.mongodb.net/tasktunesDB?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB connection failed ❌', err));


// ====== 2. Spotify Setup ======
const spotifyApi = new SpotifyWebApi({
  clientId: '1785fa4317594ca0b5fb28d1d0683e02',
  clientSecret: 'c17980368b264d7583a3f43b5f1a3bc7',
});

// Get access token
async function authorizeSpotify() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
  console.log('Spotify Authenticated ✅');
}

// ====== 3. Tasks & Moods ======
const tasks = ['Workout', 'Study', 'Relax', 'Party', 'Sleep'];
const moods = ['Energetic', 'Focused', 'Calm', 'Happy', 'Sad'];

// ====== 4. Fetch songs from Spotify with random offset ======
async function fetchSongs(task, mood, limit = 25) {
  try {
    const offset = Math.floor(Math.random() * 50); // skip 0–49 tracks randomly
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

// ====== 5. Append songs without duplicates, up to 50 per playlist ======
async function appendSongs() {
  await authorizeSpotify();

  for (const task of tasks) {
    for (const mood of moods) {
      console.log(`Fetching new songs for ${task} - ${mood}...`);
      const newSongs = await fetchSongs(task, mood);

      if (!newSongs.length) continue;

      // Find existing playlist
      let playlist = await Playlist.findOne({ task, mood });
      if (!playlist) {
        playlist = new Playlist({ task, mood, songs: [] });
      }

      // Filter out duplicates based on title + artist
      const existingSet = new Set(playlist.songs.map(s => `${s.title}-${s.artist}`));
      const uniqueSongs = newSongs.filter(s => !existingSet.has(`${s.title}-${s.artist}`));

      // Limit total songs to 50
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