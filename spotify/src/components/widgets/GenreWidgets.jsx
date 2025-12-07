'use client';

import { useState } from 'react';
import styles from './GenreWidgets.css';

const GENRES = [
  'rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'classical', 
  'reggae', 'blues', 'country', 'metal', 'indie', 'r-n-b', 
  'soul', 'funk', 'disco', 'alternative', 'punk', 'folk', 
  'latin', 'k-pop', 'dance', 'house', 'techno', 'trance',
  'ambient', 'chill', 'synth-pop', 'new-wave', 'grunge'
];

export default function GenreWidget({ selectedGenres = [], onSelect }) {
  const [search, setSearch] = useState('');

  const filteredGenres = GENRES.filter(genre =>
    genre.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleGenreClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      onSelect(selectedGenres.filter(g => g !== genre));
    } else {

      if (selectedGenres.length < 5) {
        onSelect([...selectedGenres, genre]);
      } else {
        alert('Máximo 5 géneros seleccionados');
      }
    }
  };
  
  return (
    <div className={styles.widgetContainer}>
      {/* Header del widget */}
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>Géneros Musicales</h3>
        <div className={styles.counter}>
          {selectedGenres.length}/5
        </div>
      </div>
      
      <p className={styles.widgetDescription}>
        Selecciona hasta 5 géneros musicales que te gusten
      </p>
      
      {/* Barra de búsqueda */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar géneros (rock, pop, jazz...)"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {/* Lista de géneros */}
      <div className={styles.genresGrid}>
        {filteredGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          
          return (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`${styles.genreButton} ${
                isSelected ? styles.selected : ''
              }`}
            >
              {genre}
              {isSelected && <span className={styles.checkmark}>✓</span>}
            </button>
          );
        })}
      </div>
      
      {/* Géneros seleccionados */}
      {selectedGenres.length > 0 && (
        <div className={styles.selectedSection}>
          <h4 className={styles.selectedTitle}>Géneros seleccionados:</h4>
          <div className={styles.selectedTags}>
            {selectedGenres.map((genre) => (
              <span key={genre} className={styles.selectedTag}>
                {genre}
                <button
                  onClick={() => handleGenreClick(genre)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className={styles.instructions}>
        <p>Haz clic para seleccionar/deseleccionar géneros</p>
        <p>Máximo 5 géneros</p>
      </div>
    </div>
  );
}