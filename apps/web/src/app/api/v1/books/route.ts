import { NextRequest, NextResponse } from 'next/server';
import { cmsProvider } from '@curileta/cms';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'es';

  try {
    const books = await cmsProvider.getBooks(locale);
    return NextResponse.json({
      success: true,
      total: books.length,
      data: books,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
