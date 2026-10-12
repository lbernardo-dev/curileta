import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { getLandingLetters } from '@/lib/letters';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const source = await cmsProvider.getLetterById(id, locale);
    const letter = source ? getLandingLetters([source])[0] : undefined;
    if (!letter) {
      return NextResponse.json(
        { success: false, error: `Letter with id '${id}' not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: letter });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
