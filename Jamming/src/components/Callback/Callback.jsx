import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    // This component handles the callback from Spotify
    // The main app will handle token extraction
    window.location.href = '/';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(to bottom, #000000, #191414)',
      color: 'white'
    }}>
      <p>Redirecting...</p>
    </div>
  );
};

export default Callback;
