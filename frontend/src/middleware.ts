import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — Route Guard for /dashboard/*
 * 
 * Checks for the `auth_token` cookie on every dashboard request.
 * If missing, hard-redirects to the landing page before any page renders.
 */
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  // If no auth cookie, redirect to landing page
  if (!authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Cookie exists — allow the request through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /dashboard routes, exclude static files and API routes
    '/dashboard/:path*',
  ],
};
