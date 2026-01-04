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

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('spotify_access_token');

      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.push('/');
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleGenreSelect = (genres) => {
    setPreferences(prev => ({ ...prev, genres }));
  };

  const handleArtistSelect = (artists) => {
    setPreferences(prev => ({ ...prev, artists }));
  };

  const handleDecadeSelect = (decades) => {
    setPreferences(prev => ({ ...prev, decades }));
  };

  const handlePopularityChange = (popularity) => {
    setPreferences(prev => ({ ...prev, popularity }));
  };

  // ===== GENERAR PLAYLIST =====
  const handleGeneratePlaylist = async () => {
    if (!preferences.genres.length) {
      setError('Selecciona al menos un género');
      return;
    }

    setGenerating(true);
    setError(null);
    setResult(null);

    try {
      const { generatePlaylist } = await import('../../lib/spotify');

      const result = await generatePlaylist({
        ...preferences,
        userId: user.id
      });

      setResult(result);

      if (result.success && result.playlist?.url) {
        window.open(result.playlist.url, '_blank');
      }
    } catch (err) {
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

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Hola {user?.display_name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== COLUMNA IZQUIERDA ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Géneros (ya lo tenías) */}
            <GenreWidgets
              selectedGenres={preferences.genres}
              onSelect={handleGenreSelect}
            />

            {/* NUEVOS WIDGETS */}
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

            {/* Nombre y descripción */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <input
                className="w-full p-3 mb-3 bg-gray-900 rounded"
                value={preferences.playlistName}
                onChange={e =>
                  setPreferences(prev => ({
                    ...prev,
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
                  setPreferences(prev => ({
                    ...prev,
                    playlistDescription: e.target.value
                  }))
                }
              />
            </div>
          </div>

          {/* ===== COLUMNA DERECHA ===== */}
          <div>
            <div className="bg-gray-800 p-6 rounded-xl sticky top-6">
              <button
                onClick={handleGeneratePlaylist}
                disabled={generating}
                className="w-full bg-green-500 py-3 rounded font-bold"
              >
                {generating ? 'Creando...' : '🎵 Generar Playlist'}
              </button>

              {error && (
                <p className="text-red-400 mt-4">{error}</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}