import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const character = await cmsProvider.getCharacterBySlug(slug, locale);
    if (!character) {
      return NextResponse.json(
        { success: false, error: `Character with slug '${slug}' not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: character });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
