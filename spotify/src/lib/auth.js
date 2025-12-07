/**
 * Genera la URL de autorización de Spotify
 * @returns {string} URL para redirigir al usuario a Spotify
 */
export function generateAuthURL() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  
  console.log("DEBUG - Client ID:", clientId ? "Definido" : "No definido");
  console.log("DEBUG - Redirect URI:", redirectUri || "No definida");
  
  if (!redirectUri) {
    console.error("ERROR: NEXT_PUBLIC_REDIRECT_URI no está definida");
    return "#";
  }
  
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read'
  ];
  
  const state = generateRandomString(16);
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('spotify_auth_state', state);
  }
  
  // Versión SIMPLE y que funciona
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('response_type', 'code');
  params.append('redirect_uri', redirectUri); // SIN encodeURIComponent aquí
  params.append('scope', scopes.join(' '));
  params.append('state', state);
  params.append('show_dialog', 'false');
  
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  console.log("DEBUG - URL generada:", authUrl);
  return authUrl;
}

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

export function validateState(receivedState) {
  if (typeof window === 'undefined') return false;
  
  const savedState = sessionStorage.getItem('spotify_auth_state');
  sessionStorage.removeItem('spotify_auth_state');
  
  return savedState === receivedState;
}

export function saveTokens(tokenData) {
  if (typeof window === 'undefined') return;
  
  const { access_token, refresh_token, expires_in } = tokenData;
  const expirationTime = Date.now() + (expires_in * 1000);
  
  localStorage.setItem('spotify_access_token', access_token);
  localStorage.setItem('spotify_refresh_token', refresh_token || '');
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('spotify_access_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  
  if (token && expiration && Date.now() < parseInt(expiration)) {
    return token;
  }
  
  return null;
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  localStorage.removeItem('spotify_user_id');
}