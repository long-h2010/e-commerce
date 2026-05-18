import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({ ...routing, localeDetection: false });

const publicRoutes: string[] = ['/', '/login', '/products', '/temp'];

// Helper: Check pathname is public route
function isPublicRoute(pathname: string): boolean {
  // Remove locale prefix (/vi/, /en/)
  const withoutLocale = pathname
    .replace(/^\/(vi|en)\//, '/')
    .replace(/^\/(vi|en)$/, '/');

  return publicRoutes.some((route) => {
    if (route === '/') {
      return withoutLocale === '/' || withoutLocale === '';
    }
    return withoutLocale === route || withoutLocale.startsWith(`${route}/`);
  });
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = intlMiddleware(request);

  if (isPublicRoute(pathname)) return response;

  const token = request.cookies.get('refresh_token')?.value;

  if (!token) {
    const firstSegment = pathname.split('/')[1];
    const supportedLocales: string[] = [...routing.locales];

    const locale = supportedLocales.includes(firstSegment)
      ? firstSegment
      : routing.defaultLocale;

    const loginPath =
      locale === routing.defaultLocale ? '/login' : `/${locale}/login`;
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!_next/static|_vercel|_next/image|favicon.ico|api/public|.*\\..*).*)',
  ],
};
