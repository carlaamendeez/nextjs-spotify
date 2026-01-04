'use client';

import { useState } from 'react';
import { generatePlaylist } from '@/lib/spotify';

export default function GeneratePlaylistButton({ preferences }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePlaylist({
        ...preferences,
        playlistName: preferences.playlistName || "Mi Playlist Generada",
        playlistDescription: preferences.playlistDescription || ""
      });
      
      setResult(result);
      
      if (result.success) {
        console.log("Playlist creada:", result.playlist.url);
      }
    } catch (err) {
      setError(err.message || "Error creando la playlist");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-playlist-container">
      <button
        onClick={handleGenerate}
        disabled={loading || !preferences?.artists?.length}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            Creando Playlist...
          </span>
        ) : (
          '🎵 Generar Playlist en Spotify'
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result?.success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-800">¡Playlist creada con éxito!</h3>
          <p className="mt-2 text-green-700">{result.playlist.name}</p>
          <p className="text-sm text-green-600">{result.playlist.totalTracks} canciones añadidas</p>
          <a
            href={result.playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Abrir en Spotify
          </a>
        </div>
      )}
    </div>
  );
}