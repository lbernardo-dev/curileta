import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password || password.length > 1024) {
    return NextResponse.json({ success: false, error: 'Escribe tu correo y contraseña.' }, { status: 400 });
  }

  try {
    const auth = await createSupabaseServerClient();
    const { error: signInError } = await auth.auth.signInWithPassword({ email, password });
    if (signInError) {
      return NextResponse.json({ success: false, error: 'No se pudo validar el acceso.' }, { status: 401 });
    }

    const { data: { user } } = await auth.auth.getUser();
    if (!user) {
      await auth.auth.signOut();
      return NextResponse.json({ success: false, error: 'No tienes acceso al panel.' }, { status: 403 });
    }

    const admin = createSupabaseAdminClient();
    const { data: profile, error: profileError } = await admin
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await auth.auth.signOut();
      return NextResponse.json({ success: false, error: 'No tienes acceso al panel.' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'El acceso al panel todavía no está configurado.' },
      { status: 503 }
    );
  }
}
