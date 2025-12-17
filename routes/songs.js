const express = require('express');
const Song = require('../models/Song');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all songs
router.get('/', async (req, res) => {
  try {
    const { search, genre, limit = 50 } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = genre;
    }

    const songs = await Song.find(query).limit(parseInt(limit));
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new song (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update play count
router.patch('/:id/play', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get songs by album
router.get('/album/:albumName', async (req, res) => {
  try {
    const songs = await Song.find({ 
      album: { $regex: req.params.albumName, $options: 'i' } 
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;