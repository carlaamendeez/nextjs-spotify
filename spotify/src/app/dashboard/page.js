// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens } from '@/lib/auth';
import GenreWidget from '@/components/widgets/GenreWidget';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    const token = getAccessToken();
    
    if (!token) {
      router.push('/');
      return;
    }
    
    setToken(token);
    
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);
  
  const logout = () => {
    clearTokens();
    router.push('/');
  };
  
  const generatePlaylist = () => {
    const exampleTracks = [
      {
        id: '1',
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        album: { images: [{ url: 'https://i.scdn.co/image/ab67616d00001e02e319baafd16e84f0408af2a0' }] }
      },
      {
        id: '2',
        name: 'Blinding Lights',
        artists: [{ name: 'The Weeknd' }],
        album: { images: [{ url: 'https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b' }] }
      },
      {
        id: '3',
        name: 'Shape of You',
        artists: [{ name: 'Ed Sheeran' }],
        album: { images: [{ url: 'https://i.scdn.co/image/ab67616d00001e0295cf976a9e5727d2c45f8c96' }] }
      }
    ];
    
    setPlaylist(exampleTracks);
  };
  
  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };
  
  const clearPlaylist = () => {
    setPlaylist([]);
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Spotify Taste Mixer</h1>
          
          <div className={styles.userSection}>
            {user && (
              <div className={styles.userInfo}>
                {user.images?.[0] && (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className={styles.userImage}
                  />
                )}
                <span className={styles.userName}>
                  {user.display_name || user.email}
                </span>
              </div>
            )}
            
            <button
              onClick={logout}
              className={styles.logoutButton}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        {/* Bienvenida */}
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>
            Bienvenido{user?.display_name ? `, ${user.display_name}` : ''}
          </h2>
          <p className={styles.welcomeText}>
            Usa los widgets para crear tu playlist personalizada
          </p>
        </div>
        
        {/* Widgets y Playlist */}
        <div className={styles.contentGrid}>
          {/* Columna izquierda - Widgets */}
          <div className={styles.widgetsColumn}>
            <GenreWidget 
              selectedGenres={selectedGenres}
              onSelect={setSelectedGenres}
            />
            
            {/* Widgets placeholder */}
            <div className={styles.widgetCard}>
              <h4 className={styles.widgetTitle}>Artistas Favoritos</h4>
              <p className={styles.widgetDesc}>Widget en desarrollo</p>
              <button className={styles.widgetButton}>
                Próximamente
              </button>
            </div>
            
            {/* Botón para generar playlist */}
            <button
              onClick={generatePlaylist}
              className={styles.generateButton}
            >
              Generar Playlist
            </button>
          </div>
          
          {/* Columna derecha - Playlist */}
          <div className={styles.playlistColumn}>
            <div className={styles.playlistCard}>
              <div className={styles.playlistHeader}>
                <h3 className={styles.playlistTitle}>Tu Playlist</h3>
                <span className={styles.trackCounter}>
                  {playlist.length} canciones
                </span>
              </div>
              
              {playlist.length === 0 ? (
                <div className={styles.emptyPlaylist}>
                  <p className={styles.emptyText}>No hay canciones</p>
                  <p className={styles.emptySubtext}>
                    Genera una playlist primero
                  </p>
                </div>
              ) : (
                <div className={styles.playlistContent}>
                  {playlist.map((track) => (
                    <div key={track.id} className={styles.trackItem}>
                      {track.album.images[0] && (
                        <img 
                          src={track.album.images[0].url} 
                          alt={track.name}
                          className={styles.trackImage}
                        />
                      )}
                      <div className={styles.trackInfo}>
                        <p className={styles.trackName}>{track.name}</p>
                        <p className={styles.trackArtist}>
                          {track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeTrack(track.id)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  <div className={styles.playlistActions}>
                    <button 
                      onClick={clearPlaylist}
                      className={styles.clearButton}
                    >
                      Limpiar
                    </button>
                    <button className={styles.saveButton}>
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Información */}
        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>Información</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Token</p>
              <p className={token ? styles.validText : styles.invalidText}>
                {token ? 'Válido' : 'Inválido'}
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Géneros seleccionados</p>
              <p>{selectedGenres.length}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Plan Spotify</p>
              <p>{user?.product === 'premium' ? 'Premium' : 'Gratuito'}</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>Spotify Taste Mixer - Proyecto Final</p>
      </footer>
    </div>
  );
}