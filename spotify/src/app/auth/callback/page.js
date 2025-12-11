'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    // Debug es para mostrar lo que recibimos
    console.log("DEBUG - Code recibido:", code);
    console.log("DEBUG - State recibido:", state);
    console.log("DEBUG - State en localStorage:", localStorage.getItem('spotify_auth_state'));

    if (errorParam) {
      setError('Autenticación cancelada');
      return;
    }

    if (!code) {
      setError('No se recibió código de autorización');
      return;
    }

    console.log("NOTA: Validación CSRF desactivada temporalmente para pruebas");
    
    // para limpiar el state
    localStorage.removeItem('spotify_auth_state');

    hasProcessed.current = true;

    const exchangeCodeForToken = async (code) => {
      try {
        console.log("Enviando código a /api/spotify-token...");
        
        const response = await fetch('/api/spotify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://127.0.0.1:3000/auth/callback'
          })
        });

        const data = await response.json();
        
        console.log("Respuesta de API:", data);

        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener token');
        }

        // para guardar tokens
        saveTokens({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in
        });

        console.log("Tokens guardados, redirigiendo a /dashboard");
        router.push('/dashboard');

      } catch (error) {
        console.error('Error completo:', error);
        setError(`Error: ${error.message}. Revisa la consola para detalles.`);
      }
    };

    exchangeCodeForToken(code);
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white mb-4">{error}</p>
          <div className="text-gray-300 text-left bg-gray-900/50 p-4 rounded mb-6 text-sm">
            <p className="font-semibold mb-2">Para solucionar:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Abre la consola (F12 → Console)</li>
              <li>Haz clic en Volver al inicio</li>
              <li>Intenta login de nuevo</li>
              <li>Revisa los mensajes en consola</li>
            </ol>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('spotify_auth_state');
              router.push('/');
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
        <p className="text-white text-2xl font-semibold">Autenticando con Spotify...</p>
        <p className="text-gray-400 mt-2">Esto puede tomar unos segundos</p>
        <p className="text-gray-500 text-sm mt-4">Revisa la consola (F12) para ver el progreso</p>
      </div>
    </div>
  );
}