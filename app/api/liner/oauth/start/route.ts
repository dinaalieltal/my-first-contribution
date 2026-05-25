import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.LINER_CLIENT_ID;
  const redirectUri = process.env.LINER_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/liner/oauth/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'LINER_CLIENT_ID not configured' }, { status: 500 });
  }

  const state = crypto.randomUUID();

  // Liner OAuth 2.0 authorization endpoint
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read',
    state,
  });

  const authUrl = `https://api.getliner.com/oauth/authorize?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);
  // Store state in a short-lived cookie for CSRF validation
  response.cookies.set('liner_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}
