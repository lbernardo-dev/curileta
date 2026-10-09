import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@curileta/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rutas internas, estáticas, favicon, api, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // archivos como favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }

  // Verificar si la ruta ya incluye un locale soportado
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirigir hacia el locale por defecto (ES) manteniendo la ruta
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
