# Spotify Clone Backend

Complete backend API for the Spotify Clone application.

## Features

- **Authentication**: User registration, login with JWT tokens
- **Songs**: CRUD operations, search, play count tracking
- **Playlists**: Create, manage, add/remove songs
- **User Management**: Profile, liked songs, playlists

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Songs
- `GET /api/songs` - Get all songs (with search & filter)
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs` - Add new song (auth required)
- `PATCH /api/songs/:id/play` - Update play count
- `GET /api/songs/album/:albumName` - Get songs by album

### Playlists
- `GET /api/playlists/user` - Get user playlists (auth required)
- `GET /api/playlists/public` - Get public playlists
- `POST /api/playlists` - Create playlist (auth required)
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spotify-clone
JWT_SECRET=your_secret_key
```

3. Start MongoDB service

4. Run the server:
```bash
npm run dev
```

## Database Models

- **User**: Authentication, playlists, liked songs
- **Song**: Music metadata, play counts
- **Playlist**: User-created collections of songs

The backend automatically seeds sample songs on first run.