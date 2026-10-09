import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@curileta/cms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const book = await cmsProvider.getBookBySlug(slug, locale);
    if (!book) {
      return NextResponse.json(
        { success: false, error: `Book with slug '${slug}' not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: book });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
