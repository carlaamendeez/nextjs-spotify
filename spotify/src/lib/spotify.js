// En src/lib/spotify.js
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity, playlistName = "Mi Playlist Generada", playlistDescription = "" } = preferences;
  
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('spotify_access_token');
  }
  
  if (!token) {
    throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
  }

  let allTracks = [];

  for (const artist of artists) {
    try {
      const tracks = await fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await tracks.json();
      allTracks.push(...data.tracks);
    } catch (error) {
      console.error(`Error obteniendo tracks del artista ${artist.name}:`, error);
    }
  }

  for (const genre of genres) {
    try {
      const results = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await results.json();
      allTracks.push(...data.tracks.items);
    } catch (error) {
      console.error(`Error buscando tracks del género ${genre}:`, error);
    }
  }

  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 50);

  if (uniqueTracks.length === 0) {
    throw new Error("No se encontraron canciones con los criterios seleccionados");
  }

  try {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userResponse.json();
    const userId = userData.id;

    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription || `Playlist generada con: ${artists.map(a => a.name).join(', ')} ${genres.join(', ')}`,
          public: false
        })
      }
    );

    if (!createPlaylistResponse.ok) {
      const errorData = await createPlaylistResponse.json();
      throw new Error(`Error creando playlist: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const playlist = await createPlaylistResponse.json();

    const trackUris = uniqueTracks.map(track => track.uri);
    
    const chunkSize = 100;
    for (let i = 0; i < trackUris.length; i += chunkSize) {
      const chunk = trackUris.slice(i, i + chunkSize);
      
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: chunk,
            position: i
          })
        }
      );

      if (!addTracksResponse.ok) {
        const errorData = await addTracksResponse.json();
        console.error(`Error añadiendo canciones: ${errorData.error?.message || 'Error desconocido'}`);
      }
    }

    return {
      success: true,
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        url: playlist.external_urls.spotify,
        uri: playlist.uri,
        totalTracks: uniqueTracks.length,
        tracks: uniqueTracks.map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map(artist => artist.name),
          album: track.album.name,
          uri: track.uri
        }))
      }
    };

  } catch (error) {
    console.error("Error en generatePlaylist:", error);
    return {
      success: false,
      error: error.message,
      tracks: uniqueTracks
    };
  }
}

export function getAccessToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return token;
  }
  throw new Error('Cannot access localStorage on server');
}