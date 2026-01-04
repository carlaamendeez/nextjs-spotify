'use client';

const DECADES = [
  { label: '1950s', range: '1950–1959' },
  { label: '1960s', range: '1960–1969' },
  { label: '1970s', range: '1970–1979' },
  { label: '1980s', range: '1980–1989' },
  { label: '1990s', range: '1990–1999' },
  { label: '2000s', range: '2000–2009' },
  { label: '2010s', range: '2010–2019' },
  { label: '2020s', range: '2020–2029' }
];

export default function DecadeWidget({ selectedDecades = [], onSelect }) {
  const toggle = (decade) => {
    if (selectedDecades.includes(decade)) {
      onSelect(selectedDecades.filter(d => d !== decade));
    } else if (selectedDecades.length < 3) {
      onSelect([...selectedDecades, decade]);
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
        Décadas
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Selecciona hasta tres décadas
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DECADES.map(d => {
          const active = selectedDecades.includes(d.label);
          return (
            <button
              key={d.label}
              onClick={() => toggle(d.label)}
              className={`
                p-4 rounded-xl transition text-center
                ${active
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              `}
            >
              <div>{d.label}</div>
              <div className="text-xs opacity-70">{d.range}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
