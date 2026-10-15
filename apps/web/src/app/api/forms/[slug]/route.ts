import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { hasContactSubmissionConfiguration } from '@/lib/forms/privacy-version';

const FORM_RATE_LIMIT_MAX = 30;
const FORM_RATE_LIMIT_WINDOW_MS = 60_000;
const formFetchAttempts = new Map<string, { count: number; resetAt: number }>();

function checkFormRateLimit(ip: string): boolean {
  const now = Date.now();
  const tracker = formFetchAttempts.get(ip);
  if (formFetchAttempts.size > 1000) {
    for (const [key, val] of formFetchAttempts.entries()) {
      if (val.resetAt < now) formFetchAttempts.delete(key);
    }
  }
  if (!tracker || tracker.resetAt < now) {
    formFetchAttempts.set(ip, { count: 1, resetAt: now + FORM_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (tracker.count >= FORM_RATE_LIMIT_MAX) {
    return false;
  }
  tracker.count += 1;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  if (!checkFormRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: 'Demasiadas solicitudes. Espera un momento.' },
      { status: 429, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  if (process.env.NODE_ENV === 'production' && !hasContactSubmissionConfiguration()) {
    return NextResponse.json(
      { success: false, error: 'El formulario necesita configuración antispam.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  const { slug } = await params;
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'es';

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ success: false, error: 'No se encontró el formulario.' }, { status: 404 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: form, error } = await supabase
      .from('contact_forms')
      .select('id, slug, title, description, enabled, fields')
      .eq('slug', slug)
      .eq('enabled', true)
      .maybeSingle();

    if (error) throw error;
    if (!form) return NextResponse.json({ success: false, error: 'Este formulario no está disponible.' }, { status: 404 });

    return NextResponse.json({ success: true, data: form, locale }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'El formulario todavía no está conectado a la base de datos.' },
      { status: 503 }
    );
  }
}
