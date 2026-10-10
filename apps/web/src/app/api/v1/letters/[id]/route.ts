import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const letter = await cmsProvider.getLetterById(id, locale);
    if (!letter) {
      return NextResponse.json(
        { success: false, error: `Letter with id '${id}' not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: letter });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
