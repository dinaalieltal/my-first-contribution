import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'unknown';

  const clientId = process.env.LINER_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/liner/oauth/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'LINER_CLIENT_ID not configured' }, { status: 500 });
  }

  // Build Liner OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read',
    state: userId, // carry userId through the OAuth flow
  });

  const authUrl = `https://getliner.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
