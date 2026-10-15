import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const tracker = loginAttempts.get(ip);
  if (loginAttempts.size > 1000) {
    for (const [key, val] of loginAttempts.entries()) {
      if (val.resetAt < now) loginAttempts.delete(key);
    }
  }
  if (!tracker || tracker.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (tracker.count >= LOGIN_RATE_LIMIT_MAX) {
    return false;
  }
  tracker.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  if (!checkLoginRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: 'Demasiados intentos de acceso. Por favor, espera 15 minutos antes de volver a intentarlo.' },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ success: false, error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
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
      const status = signInError.status === 429 ? 429 : 401;
      return NextResponse.json({
        success: false,
        error: status === 429
          ? 'Se han realizado demasiados intentos. Espera antes de volver a probar.'
          : 'No se pudo validar el acceso.',
      }, { status });
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
