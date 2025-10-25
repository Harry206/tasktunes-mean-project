const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://tasktunesUser:tasktunesdatabasepassword91@tasktunescluster.ei2i8u3.mongodb.net/tasktunesDB?retryWrites=true&w=majority&appName=TaskTunesCluster')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));


// Import your models
const Playlist = require('./models/playlist'); // your playlist schema

// --- Routes ---

app.get('/', (req, res) => {
  res.send('✅ TaskTunes backend is running!');
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    // Get distinct tasks from MongoDB
    const tasks = await Playlist.distinct('task');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET moods for a task
app.get('/api/moods/:task', async (req, res) => {
  try {
    const { task } = req.params;
    const moods = await Playlist.find({ task }).distinct('mood');
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET playlist for task + mood
// routes/playlist.js or in your server.js
app.get('/api/playlists/:task/:mood', async (req, res) => {
  const { task, mood } = req.params;
  try {
    const playlistDoc = await Playlist.findOne({ task, mood }).lean();
    if (!playlistDoc) return res.status(404).json([]);
    res.json(playlistDoc.songs); // return all songs
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
