// src/app/api/refresh-token/route.js

export async function POST(request) {
  try {
    const { refresh_token } = await request.json();
    
    if (!refresh_token) {
      return Response.json(
        { error: 'Refresh token requerido' },
        { status: 400 }
      );
    }
    
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);
    
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
      console.error('Error refrescando token:', data);
      return Response.json(
        { error: data.error_description || 'Error al refrescar token' },
        { status: response.status }
      );
    }
    
    return Response.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refresh_token, 
      expires_in: data.expires_in,
      token_type: data.token_type
    });
    
  } catch (error) {
    console.error('Error en refresh-token API:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}