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
  origin: ['http://localhost:5173', 'http://localhost:5174'],
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
        { title: "Powerhouse", artist: "Raymond Scott", album: "Cartoon Music", duration: "2:45", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://raw.githubusercontent.com/deepakdeepakp/Spotify_frontend/master/public/Powerhouse-64kbps.mp3", genre: "Instrumental", playCount: 0 },
        { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3", genre: "Pop", playCount: 0 },
        { title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://file-examples.com/storage/fe68c8a7c4bb3b2b8e8b3b8/2017/11/file_example_MP3_700KB.mp3", genre: "Pop", playCount: 0 },
        { title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://file-examples.com/storage/fe68c8a7c4bb3b2b8e8b3b8/2017/11/file_example_MP3_1MG.mp3", genre: "Pop", playCount: 0 },
        { title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://file-examples.com/storage/fe68c8a7c4bb3b2b8e8b3b8/2017/11/file_example_MP3_2MG.mp3", genre: "Pop", playCount: 0 },
        { title: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*CK LOVE 3", duration: "2:21", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://file-examples.com/storage/fe68c8a7c4bb3b2b8e8b3b8/2017/11/file_example_MP3_5MG.mp3", genre: "Pop", playCount: 0 },
        { title: "Vaathi Coming", artist: "Anirudh Ravichander", album: "Master", duration: "4:20", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://raw.githubusercontent.com/deepakdeepakp/Spotify_frontend/master/public/Vaathi%20Raid.mp3", genre: "Tamil", playCount: 0 },
        { title: "Kutti Story", artist: "Anirudh Ravichander", album: "Master", duration: "3:45", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Rowdy Baby", artist: "Dhanush, Dhee", album: "Maari 2", duration: "4:10", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Kaavaalaa", artist: "Shilpa Rao, Anirudh", album: "Jailer", duration: "4:05", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", album: "RRR", duration: "4:28", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Telugu", playCount: 0 },
        { title: "Aalaporaan Tamizhan", artist: "A.R. Rahman", album: "Mersal", duration: "4:32", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Marana Mass", artist: "Anirudh Ravichander", album: "Petta", duration: "4:18", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Oo Antava", artist: "Indravathi Chauhan", album: "Pushpa", duration: "3:52", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Telugu", playCount: 0 },
        { title: "Thalli Pogathey", artist: "A.R. Rahman", album: "Achcham Yenbadhu Madamaiyada", duration: "4:55", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Kannaana Kanney", artist: "Sid Sriram", album: "Viswasam", duration: "4:12", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Bigil Bigil Bigiluma", artist: "A.R. Rahman", album: "Bigil", duration: "4:08", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Singappenney", artist: "A.R. Rahman", album: "Bigil", duration: "3:58", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Verithanam", artist: "A.R. Rahman", album: "Bigil", duration: "4:22", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Kadhal Rojave", artist: "A.R. Rahman", album: "Roja", duration: "5:15", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Munbe Vaa", artist: "A.R. Rahman", album: "Sillunu Oru Kaadhal", duration: "4:45", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Jimikki Kammal", artist: "Vineeth Sreenivasan", album: "Velipadinte Pusthakam", duration: "3:28", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Malayalam", playCount: 0 },
        { title: "Dheeme Dheeme", artist: "Yuvan Shankar Raja", album: "Petta", duration: "3:35", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Surviva", artist: "Yogi B, Mali", album: "Vivegam", duration: "3:42", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", genre: "Tamil", playCount: 0 },
        { title: "Adchithooku", artist: "D. Imman", album: "Viswasam", duration: "3:38", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", genre: "Tamil", playCount: 0 },
        { title: "Psycho Saiyaan", artist: "Dhvani Bhanushali, Sachet Tandon", album: "Saaho", duration: "4:25", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav", genre: "Hindi", playCount: 0 }
      ];
      await Song.insertMany(sampleSongs);
      console.log('🎵 Sample songs added to database');
    }
  } catch (error) {
    console.log('⚠️ Error seeding database:', error.message);
  }
};

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Spotify Clone Backend API' });
});

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
