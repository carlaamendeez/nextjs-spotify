export async function POST(request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return Response.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')
      },
      body: params
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error obteniendo token:', data);
      return Response.json(
        { error: data.error_description || 'Error al obtener token' },
        { status: response.status }
      );
    }

    return Response.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type
    });
    
  } catch (error) {
    console.error('Error en spotify-token API:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}