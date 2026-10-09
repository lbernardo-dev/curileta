import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * Webhook para invalidación de caché On-Demand de Sanity (Section 64)
 * Permite que los editores vean sus cambios inmediatamente sin reconstruir toda la app.
 */
export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.SANITY_REVALIDATE_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
    }

    const body = await request.json();
    const { _type, slug, _id } = body;

    // Invalidar tags específicos según la entidad modificada
    if (_type === 'character') {
      revalidateTag(`character:${_id}`);
      revalidateTag('characters');
    } else if (_type === 'book') {
      revalidateTag(`book:${_id}`);
      revalidateTag('books');
    } else if (_type === 'adventure') {
      revalidateTag(`adventure:${_id}`);
      revalidateTag('adventures');
    } else if (_type === 'video') {
      revalidateTag('videos');
    }

    // Invalidar la home si el contenido afecta a la portada
    revalidateTag('homepage');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      id: _id,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: 'Error revalidating', error: errorMessage }, { status: 500 });
  }
}
