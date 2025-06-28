import React from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

const SearchResults = ({ searchResults, onAdd }) => {
  return (
    <div className="search-results">
      <div className="search-results-header">
        <h2>Results</h2>
      </div>
      <TrackList tracks={searchResults} onAdd={onAdd} />
    </div>
  );
};

export default SearchResults;
