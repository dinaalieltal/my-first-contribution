import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('liner_connections')
    .select('liner_user_name, liner_user_email, updated_at')
    .eq('user_id', userId)
    .single();

  return NextResponse.json({ connected: !!data, connection: data ?? null });
}
