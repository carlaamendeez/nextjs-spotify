'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '../../components/widgets/Header';
import GenreWidgets from '../../components/widgets/GenreWidgets';
import ArtistWidget from '../../components/widgets/ArtistWidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';
import PopularityWidget from '../../components/widgets/PopularityWidget';

export default function DashboardPage() {
  const [preferences, setPreferences] = useState({
    artists: [],
    genres: [],
    decades: [],
    popularity: [70, 100],
    playlistName: 'Mi Playlist Personalizada',
    playlistDescription: ''
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [favoriteTracks, setFavoriteTracks] = useState([]);

  const [previewTracks, setPreviewTracks] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setUser(await res.json());
      } else {
        router.push('/');
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem('favorite_tracks')
    ) || [];
    setFavoriteTracks(stored);
  }, []);

  const toggleFavoriteTrack = (trackId) => {
    setFavoriteTracks(prev => {
      const updated = prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId];

      localStorage.setItem(
        'favorite_tracks',
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const removeTrack = (trackId) => {
    setPreviewTracks(prev =>
      prev.filter(track => track.id !== trackId)
    );
  };

  const handleGenreSelect = (genres) =>
    setPreferences(prev => ({ ...prev, genres }));

  const handleArtistSelect = (artists) =>
    setPreferences(prev => ({ ...prev, artists }));

  const handleDecadeSelect = (decades) =>
    setPreferences(prev => ({ ...prev, decades }));

  const handlePopularityChange = (popularity) =>
    setPreferences(prev => ({ ...prev, popularity }));

  const generate = async ({ append = false } = {}) => {
    if (!preferences.genres.length) {
      setError('Selecciona al menos un género');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const { generatePlaylist } = await import('../../lib/spotify');

      const res = await generatePlaylist({
        ...preferences,
        userId: user.id
      });

      if (res.success && res.playlist?.tracks) {
        setResult(res);

        setPreviewTracks(prev =>
          append
            ? [...prev, ...res.playlist.tracks]
            : res.playlist.tracks
        );

        if (!append && res.playlist?.url) {
          window.open(res.playlist.url, '_blank');
        }
      }
    } catch {
      setError('Error creando la playlist');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Hola {user?.display_name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
            <GenreWidgets
              selectedGenres={preferences.genres}
              onSelect={handleGenreSelect}
            />

            <ArtistWidget
              selectedArtists={preferences.artists}
              onSelect={handleArtistSelect}
            />

            <DecadeWidget
              selectedDecades={preferences.decades}
              onSelect={handleDecadeSelect}
            />

            <PopularityWidget
              popularity={preferences.popularity}
              onChange={handlePopularityChange}
            />

            <div className="bg-gray-800 p-6 rounded-xl">
              <input
                className="w-full p-3 mb-3 bg-gray-900 rounded"
                value={preferences.playlistName}
                onChange={e =>
                  setPreferences(p => ({
                    ...p,
                    playlistName: e.target.value
                  }))
                }
              />

              <textarea
                className="w-full p-3 bg-gray-900 rounded"
                rows="2"
                placeholder="Descripción opcional"
                value={preferences.playlistDescription}
                onChange={e =>
                  setPreferences(p => ({
                    ...p,
                    playlistDescription: e.target.value
                  }))
                }
              />
            </div>
          </div>

          {/* DERECHA */}
          <div>
            <div className="bg-gray-800 p-6 rounded-xl sticky top-6 space-y-4">
              <button
                onClick={() => generate({ append: false })}
                disabled={generating}
                className="w-full bg-green-500 py-3 rounded font-bold"
              >
                {generating ? 'Creando...' : 'Generar playlist'}
              </button>

              <button
                onClick={() => generate({ append: true })}
                disabled={generating || previewTracks.length === 0}
                className="w-full bg-blue-500 py-2 rounded font-semibold"
              >
                Añadir más canciones
              </button>

              <button
                onClick={() => generate({ append: false })}
                disabled={generating || previewTracks.length === 0}
                className="w-full bg-gray-600 py-2 rounded"
              >
                Refrescar playlist
              </button>

              {error && (
                <p className="text-red-400">{error}</p>
              )}

              {previewTracks.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">
                    Preview de la playlist
                  </h3>

                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {previewTracks.map(track => {
                      const isFav = favoriteTracks.includes(track.id);

                      return (
                        <li
                          key={track.id}
                          className="flex justify-between items-center bg-gray-700 p-3 rounded gap-3"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{track.name}</p>
                            <p className="text-sm text-gray-400">
                              {track.artists.join(', ')}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleFavoriteTrack(track.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                isFav
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-gray-600 text-white'
                              }`}
                            >
                              {isFav ? 'Favorito' : 'Marcar'}
                            </button>

                            <button
                              onClick={() => removeTrack(track.id)}
                              className="px-3 py-1 rounded text-sm bg-red-500 text-white"
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
