const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scope = 'user-read-private playlist-modify-public playlist-modify-private';

// Debug logging
console.log('Environment variables loaded:');
console.log('Client ID:', clientId);
console.log('Redirect URI:', redirectUri);

let accessToken = '';

// Generate random string for PKCE
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Generate code challenge for PKCE
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const Spotify = {
  // Get access token using Authorization Code with PKCE
  async getAccessToken() {
    if (accessToken) {
      console.log('Using existing access token');
      return accessToken;
    }

    console.log('Current URL:', window.location.href);
    
    // Check for authorization code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Spotify authorization error:', error);
      // Clear URL and try again
      window.history.replaceState({}, document.title, '/');
      return null;
    }
    
    if (code) {
      console.log('Found authorization code, exchanging for token...');
      const codeVerifier = localStorage.getItem('code_verifier');
      
      if (!codeVerifier) {
        console.error('Code verifier not found in localStorage');
        window.history.replaceState({}, document.title, '/');
        return null;
      }
      
      try {
        // Exchange code for access token
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        });

        console.log('Token exchange response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Token exchange failed:', errorData);
          throw new Error('Token exchange failed');
        }

        const data = await response.json();
        console.log('Token exchange successful');
        
        accessToken = data.access_token;
        
        // Clean up
        localStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, '/');
        
        // Set expiration
        if (data.expires_in) {
          setTimeout(() => {
            accessToken = '';
          }, data.expires_in * 1000);
        }
        
        return accessToken;
        
      } catch (error) {
        console.error('Error during token exchange:', error);
        localStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, '/');
        return null;
      }
    }
    
    // No code, need to redirect to Spotify for authorization
    console.log('No authorization code found, redirecting to Spotify...');
    
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    
    // Store code verifier
    localStorage.setItem('code_verifier', codeVerifier);
    
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('scope', scope);
    
    console.log('Redirecting to Spotify authorization...');
    window.location.href = authUrl.toString();
    
    return null; // Will redirect before returning
  },

  // Search for tracks using Spotify API
  async search(term) {
    console.log('Search called with term:', term);
    
    try {
      const token = await Spotify.getAccessToken();
      console.log('Access token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        console.log('No access token available, cannot search');
        return [];
      }
      
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Search response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear it
          accessToken = '';
          console.log('Token invalid, cleared. Try searching again.');
        }
        throw new Error(`Search request failed: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('Search successful, found tracks:', jsonResponse.tracks?.items?.length || 0);
      
      if (!jsonResponse.tracks || !jsonResponse.tracks.items) {
        return [];
      }

      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  },

  // Save a playlist to user's Spotify account
  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const token = await Spotify.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }
    
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    let userId;

    try {
      // Get user ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user information');
      }
      
      const userJson = await userResponse.json();
      userId = userJson.id;

      // Create playlist
      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          name: name,
          description: 'Created with Jamming',
          public: false
        })
      });

      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
      }

      const playlistJson = await playlistResponse.json();
      const playlistId = playlistJson.id;

      // Add tracks to playlist
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ uris: trackUris })
      });

      if (!tracksResponse.ok) {
        throw new Error('Failed to add tracks to playlist');
      }

      return playlistId;
    } catch (error) {
      console.error('Error saving playlist:', error);
      throw error;
    }
  }
};

export default Spotify;
