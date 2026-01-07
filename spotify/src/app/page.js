'use client';

import { useState, useEffect } from 'react';
import { generateAuthURL, getAccessToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);
  
  const handleLogin = () => {
    const authUrl = generateAuthURL();
    window.location.href = authUrl;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <span className="text-4xl">🎵</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Spotify Taste Mixer
          </h1>
          <p className="text-gray-400 text-lg">
            Crea playlists personalizadas basadas en tu gusto musical
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Características principales
          </h2>
          <ul className="text-gray-300 space-y-3 text-left">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Genera playlists con tus artistas favoritos</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Selecciona géneros, décadas y mood</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Guarda tus playlists en Spotify</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Marca canciones como favoritas</span>
            </li>
          </ul>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🎵</span>
          <span>Iniciar sesión con Spotify</span>
        </button>
        
        <p className="text-gray-400 text-sm mt-6">
          Necesitarás una cuenta de Spotify (gratuita o premium) para usar esta aplicación
        </p>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>2024 Spotify Taste Mixer. Este proyecto usa la API de Spotify.</p>
        <p className="mt-1">No almacenamos tus datos de acceso.</p>
      </footer>
    </div>
  );
}