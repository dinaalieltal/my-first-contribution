import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const userId = req.nextUrl.searchParams.get('state');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!code || !userId) {
    return NextResponse.redirect(`${appUrl}/settings?liner_error=missing_params`);
  }

  const clientId = process.env.LINER_CLIENT_ID!;
  const clientSecret = process.env.LINER_CLIENT_SECRET!;
  const redirectUri = `${appUrl}/api/liner/oauth/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://getliner.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Liner token exchange failed:', err);
      return NextResponse.redirect(`${appUrl}/settings?liner_error=token_exchange`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch Liner user profile
    let linerUser: { id?: string; email?: string; name?: string } = {};
    try {
      const profileRes = await fetch('https://getliner.com/api/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (profileRes.ok) {
        linerUser = await profileRes.json();
      }
    } catch {
      // Non-fatal — proceed without profile info
    }

    const tokenExpiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    // Upsert connection in Supabase
    const { error } = await supabase.from('liner_connections').upsert({
      user_id: userId,
      liner_user_id: linerUser.id || null,
      liner_email: linerUser.email || null,
      liner_name: linerUser.name || null,
      access_token,
      refresh_token: refresh_token || null,
      token_expires_at: tokenExpiresAt,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.redirect(`${appUrl}/settings?liner_error=db_error`);
    }

    return NextResponse.redirect(`${appUrl}/settings?liner_connected=1`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${appUrl}/settings?liner_error=unexpected`);
  }
}
