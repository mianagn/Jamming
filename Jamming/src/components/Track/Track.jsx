import React from 'react';
import './Track.css';

const Track = ({ track, onAdd, onRemove, isRemoval = false }) => {
  const handleAction = () => {
    if (isRemoval) {
      onRemove(track);
    } else {
      onAdd(track);
    }
  };

  return (
    <div className="track">
      <div className="track-info">
        <h3 className="track-name">{track.name}</h3>
        <p className="track-details">
          {track.artist} | {track.album}
        </p>
      </div>
      <button 
        className={`track-action ${isRemoval ? 'remove' : 'add'}`}
        onClick={handleAction}
      >
        {isRemoval ? '-' : '+'}
      </button>
    </div>
  );
};

export default Track;
