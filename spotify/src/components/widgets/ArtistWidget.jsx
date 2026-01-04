'use client';

import { useState, useEffect } from 'react';

export default function ArtistWidget({ selectedArtists = [], onSelect }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('spotify_access_token');
    setToken(t);
  }, []);

  useEffect(() => {
    if (!search.trim() || !token) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(search)}&type=artist&limit=6`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.artists?.items || []);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, token]);

  const toggleArtist = (artist) => {
    if (selectedArtists.find(a => a.id === artist.id)) {
      onSelect(selectedArtists.filter(a => a.id !== artist.id));
    } else if (selectedArtists.length < 5) {
      onSelect([...selectedArtists, artist]);
    }
  };

  return (
    <div className="
      bg-gradient-to-br from-gray-800 to-gray-900
      rounded-2xl p-6
      border border-gray-700
      shadow-lg
    ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-extrabold text-white">
          Artistas favoritos
        </h3>
        <span className="text-sm text-gray-400">
          {selectedArtists.length}/5
        </span>
      </div>

      <input
        type="text"
        placeholder="Buscar artistas"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full p-3 mb-4
          bg-gray-900 border border-gray-700 rounded-lg
          text-white
          focus:outline-none focus:ring-2 focus:ring-green-500
        "
      />

      <div className="space-y-3">
        {results.map((artist) => {
          const selected = selectedArtists.find(a => a.id === artist.id);
          return (
            <div
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer transition
                ${selected
                  ? 'bg-green-500/20 border border-green-500/40'
                  : 'bg-gray-700 hover:bg-gray-600'}
              `}
            >
              <div className="flex items-center gap-3">
                {artist.images?.[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span className="text-white">{artist.name}</span>
              </div>
              <span className="text-sm text-gray-300">
                {selected ? 'Seleccionado' : 'Seleccionar'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
