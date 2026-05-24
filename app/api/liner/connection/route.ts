import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ connection: null });

  const { data, error } = await supabase
    .from('liner_connections')
    .select('liner_name, liner_email, connected_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) return NextResponse.json({ connection: null });

  return NextResponse.json({ connection: data });
}
