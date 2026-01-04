'use client';

const GENRES = [
  'pop',
  'rock',
  'indie',
  'hip-hop',
  'electronic',
  'jazz',
  'classical',
  'reggaeton',
  'metal',
  'blues'
];

export default function GenreWidgets({ selectedGenres = [], onSelect }) {
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onSelect(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 5) {
        onSelect([...selectedGenres, genre]);
      }
    }
  };

  return (
    <div className="
      bg-gradient-to-br from-gray-800 to-gray-900
      rounded-2xl p-6
      border border-gray-700
      shadow-lg
    ">
      <h3 className="text-2xl font-extrabold text-white mb-1">
        Géneros
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Selecciona hasta cinco géneros musicales
      </p>

      <div className="flex flex-wrap gap-3">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${selectedGenres.includes(genre)
                ? 'bg-green-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
