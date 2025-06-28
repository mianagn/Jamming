import React, { useState } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

const Playlist = ({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(playlistName);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    onNameChange(tempName);
    setIsEditing(false);
  };

  const handleNameClick = () => {
    setIsEditing(true);
    setTempName(playlistName);
  };

  return (
    <div className="playlist">
      <div className="playlist-header">
        {isEditing ? (
          <form onSubmit={handleNameSubmit} className="playlist-name-form">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="playlist-name-input"
              autoFocus
              onBlur={handleNameSubmit}
            />
          </form>
        ) : (
          <h2 className="playlist-name" onClick={handleNameClick}>
            {playlistName}
          </h2>
        )}
      </div>
      
      <TrackList 
        tracks={playlistTracks} 
        onRemove={onRemove} 
        isRemoval={true} 
      />
      
      <button 
        className="save-playlist-button"
        onClick={onSave}
        disabled={playlistTracks.length === 0}
      >
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
