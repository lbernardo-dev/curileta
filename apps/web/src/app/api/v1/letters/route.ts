import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@/lib/cms';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const letters = await cmsProvider.getLetters(locale);
    return NextResponse.json({
      success: true,
      total: letters.length,
      data: letters,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
