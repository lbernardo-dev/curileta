import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV === 'production'
    && (!process.env.TURNSTILE_SECRET_KEY
      || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      || !process.env.PRIVACY_NOTICE_VERSION)) {
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
