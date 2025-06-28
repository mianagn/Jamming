import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

const TrackList = ({ tracks, onAdd, onRemove, isRemoval = false }) => {
  return (
    <div className="tracklist">
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;
