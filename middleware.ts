import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value || '';


  const publicPaths = ['/', '/login', '/register', '/verifyemail'];
  const isPublicPath = publicPaths.includes(path);

  // If the user is logged in and tries to access a public route, redirect to /dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not logged in and tries to access a private route, redirect to /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/verifyemail',
    '/dashboard/:path*',
    '/profile/:path*',
    '/matches/:path*',
    '/courses/:path*',
    '/community/:path*',
    '/challenges/:path*',
    '/sessions/:path*',
  ],
};
