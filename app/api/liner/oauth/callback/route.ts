import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(`${appUrl}/settings?error=liner_denied`);
  }

  // Validate state (CSRF)
  const storedState = request.cookies.get('liner_oauth_state')?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/settings?error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?error=no_code`);
  }

  try {
    const redirectUri = process.env.LINER_REDIRECT_URI ||
      `${appUrl}/api/liner/oauth/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://api.getliner.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.LINER_CLIENT_ID,
        client_secret: process.env.LINER_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokens = await tokenRes.json();

    // Fetch Liner user profile
    let linerUser: { id?: string; email?: string; name?: string } = {};
    try {
      const profileRes = await fetch('https://api.getliner.com/v1/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (profileRes.ok) linerUser = await profileRes.json();
    } catch { /* profile fetch is non-fatal */ }

    // Get Orchpad user from session cookie (use service client for server-side upsert)
    const supabase = createServiceClient();

    // We'll use a demo user ID derived from the Liner user for now
    // In a real Orchpad integration, pull from the session
    const userId = linerUser.id ? `liner_${linerUser.id}` : `anon_${crypto.randomUUID()}`;

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    await supabase.from('liner_connections').upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      token_expires_at: expiresAt,
      liner_user_id: linerUser.id ?? null,
      liner_user_email: linerUser.email ?? null,
      liner_user_name: linerUser.name ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    const response = NextResponse.redirect(`${appUrl}/settings?connected=true`);
    response.cookies.delete('liner_oauth_state');
    return response;
  } catch (err) {
    console.error('Liner OAuth callback error:', err);
    return NextResponse.redirect(`${appUrl}/settings?error=oauth_failed`);
  }
}
