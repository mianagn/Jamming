import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './util/Spotify';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Search for tracks
  const search = async (searchTerm) => {
    try {
      const results = await Spotify.search(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    }
  };

  // Add track to playlist
  const addTrack = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return; // Track already exists
    }
    setPlaylistTracks(prev => [...prev, track]);
  };

  // Remove track from playlist
  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(savedTrack => savedTrack.id !== track.id));
  };

  // Update playlist name
  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  // Save playlist to Spotify
  const savePlaylist = async () => {
    if (!playlistName || playlistTracks.length === 0) {
      alert('Please add tracks to your playlist before saving.');
      return;
    }

    try {
      const trackURIs = playlistTracks.map(track => track.uri);
      await Spotify.savePlaylist(playlistName, trackURIs);
      
      // Reset playlist after successful save
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
      setSearchResults([]);
      
      alert('Playlist saved successfully to your Spotify account!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save playlist. Please try again.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ja<span className="highlight">mm</span>ing</h1>
      </header>
      
      <SearchBar onSearch={search} />
      
      <div className="app-playlist">
        <SearchResults 
          searchResults={searchResults} 
          onAdd={addTrack} 
        />
        <Playlist 
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={updatePlaylistName}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
