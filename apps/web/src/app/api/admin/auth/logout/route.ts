import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Clearing the browser session is best effort when Supabase is unavailable.
  }

  return NextResponse.json({ success: true });
}
