'use client';

export default function PopularityWidget({ popularity = [70, 100], onChange }) {
  return (
    <div className="
      bg-gradient-to-br from-gray-800 to-gray-900
      rounded-2xl p-6
      border border-gray-700
      shadow-lg
    ">
      <h3 className="text-2xl font-extrabold text-white mb-4">
        Popularidad
      </h3>

      <p className="text-gray-400 mb-4">
        Rango seleccionado: {popularity[0]} – {popularity[1]}
      </p>

      <input
        type="range"
        min="0"
        max="100"
        value={popularity[0]}
        onChange={(e) => onChange([Number(e.target.value), popularity[1]])}
        className="w-full mb-3"
      />

      <input
        type="range"
        min="0"
        max="100"
        value={popularity[1]}
        onChange={(e) => onChange([popularity[0], Number(e.target.value)])}
        className="w-full"
      />
    </div>
  );
}
