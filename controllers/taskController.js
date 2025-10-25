const Playlist = require('../models/playlist');

exports.getPlaylist = async (req, res) => {
  const { task, mood } = req.params;

  try {
    const playlist = await Playlist.findOne({ task, mood });

    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    // Map songs for frontend
    const songs = playlist.songs.map(song => ({
      title: song.title,
      artist: song.artist,
      link: song.url
    }));

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
