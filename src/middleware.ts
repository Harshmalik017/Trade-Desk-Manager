import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH, SESSION_COOKIE, parseSession, safeNextPath } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLoginRoute = pathname === ADMIN_LOGIN_PATH;

  if (!session && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (session && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = safeNextPath(request.nextUrl.searchParams.get('next')) || ADMIN_HOME_PATH;
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
