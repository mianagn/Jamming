# Jamming - Spotify Playlist Creator

A React web application that allows users to search the Spotify library, create custom playlists, and save them to their Spotify account.

## Features

- **Search Spotify Library**: Search for songs, artists, and albums using the Spotify Web API
- **Create Custom Playlists**: Add tracks to a custom playlist
- **Edit Playlist Names**: Click on playlist name to edit it
- **Save to Spotify**: Save your custom playlists directly to your Spotify account
- **Responsive Design**: Works on desktop and mobile devices

## Components Structure

```
src/
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.jsx       # Search input component
│   │   └── SearchBar.css
│   ├── SearchResults/
│   │   ├── SearchResults.jsx   # Display search results
│   │   └── SearchResults.css
│   ├── Playlist/
│   │   ├── Playlist.jsx        # Custom playlist component
│   │   └── Playlist.css
│   ├── TrackList/
│   │   ├── TrackList.jsx       # List of tracks component
│   │   └── TrackList.css
│   ├── Track/
│   │   ├── Track.jsx           # Individual track component
│   │   └── Track.css
│   └── Callback/
│       └── Callback.jsx        # Spotify auth callback
├── util/
│   └── Spotify.js              # Spotify API integration
├── App.jsx                     # Main app component
├── App.css
├── index.css
└── main.jsx
```

## Setup Instructions

### 1. Spotify App Registration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App Name**: Jamming (or your preferred name)
   - **App Description**: A React app for creating Spotify playlists
   - **Redirect URI**: `http://127.0.0.1:5173/callback`
   - **Website**: `http://127.0.0.1:5173`
   - **API Used**: Web API
5. Save your app and note down the **Client ID**

### 2. Environment Configuration

Create a `.env` file in the root directory with your Spotify credentials:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

Replace `your_spotify_client_id_here` with your actual Spotify Client ID.

### 3. Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://127.0.0.1:5173`

## How to Use

1. **Authentication**: The app will redirect you to Spotify for authentication on first use
2. **Search**: Use the search bar to find songs, artists, or albums
3. **Add Tracks**: Click the "+" button next to tracks to add them to your playlist
4. **Edit Playlist**: Click on the playlist name to edit it
5. **Remove Tracks**: Click the "-" button to remove tracks from your playlist  
6. **Save**: Click "SAVE TO SPOTIFY" to save your playlist to your Spotify account

## Technologies Used

- **React 19.1.0**: UI library
- **Vite**: Build tool and development server
- **Spotify Web API**: Music data and playlist management
- **CSS3**: Styling with modern features
- **ES6+**: Modern JavaScript features

## API Integration

The app uses the Spotify Web API with the following endpoints:

- **Authorization**: `https://accounts.spotify.com/authorize`
- **Search**: `https://api.spotify.com/v1/search`
- **User Profile**: `https://api.spotify.com/v1/me`
- **Create Playlist**: `https://api.spotify.com/v1/users/{user_id}/playlists`
- **Add Tracks**: `https://api.spotify.com/v1/playlists/{playlist_id}/tracks`

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Component Architecture

The app follows a component-based architecture with:

- **Stateful Components**: App.jsx (main state management)
- **Functional Components**: All other components are functional with hooks
- **Props Flow**: Data flows down, events flow up
- **API Layer**: Centralized in `util/Spotify.js`

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Check your Spotify Client ID in the `.env` file
2. **Redirect URI mismatch**: Ensure the redirect URI matches exactly in your Spotify app settings
3. **Search not working**: Make sure you're authenticated with Spotify
4. **Save playlist fails**: Check that you have proper permissions and are logged into Spotify

### CORS Issues

If you encounter CORS issues, make sure you're using `http://127.0.0.1:5173` instead of `localhost:5173` as Spotify's API has specific requirements for redirect URIs.

## License

This project is for educational purposes. Spotify's terms of service apply to the use of their API.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
