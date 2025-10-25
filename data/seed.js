// seed.js
const mongoose = require('mongoose');
const Playlist = require('./models/playlist');

mongoose.connect('mongodb+srv://tasktunesUser:yourpassword@tasktunescluster.ei2i8u3.mongodb.net/tasktunesDB?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const tasks = ['Workout', 'Study', 'Relax', 'Party', 'Sleep'];
const moods = ['Energetic', 'Focused', 'Calm', 'Happy', 'Sad'];

async function seed() {
  await Playlist.deleteMany({}); // clear previous

  for (const task of tasks) {
    for (const mood of moods) {
      const songs = [];
      for (let i = 1; i <= 25; i++) {
        songs.push({
          title: `${task} ${mood} Song ${i}`,
          artist: `Artist ${i}`,
          url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`
        });
      }

      const playlist = new Playlist({ task, mood, songs });
      await playlist.save();
    }
  }

  console.log('Database seeded ✅');
  mongoose.disconnect();
}

seed();
