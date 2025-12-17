const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const Song = require('./models/Song');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with timeout fix
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  bufferCommands: false
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  seedDatabase();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  // process.exit(1);
});

// Seed database with sample songs
const seedDatabase = async () => {
  try {
    const count = await Song.countDocuments();
    if (count === 0) {
      const sampleSongs = [
        {
          title: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          duration: "3:20",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          genre: "Pop"
        },
        {
          title: "Vaathi Coming",
          artist: "Anirudh Ravichander",
          album: "Master",
          duration: "4:20",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          genre: "Tamil"
        }
      ];
      await Song.insertMany(sampleSongs);
      console.log('🎵 Sample songs added to database');
    }
  } catch (error) {
    console.log('⚠️ Error seeding database:', error.message);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Spotify Clone Backend is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});
