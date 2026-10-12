import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';
import { getLandingLetters } from '@/lib/letters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const letters = getLandingLetters(await cmsProvider.getLetters(locale));
    return NextResponse.json({
      success: true,
      total: letters.length,
      data: letters,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
