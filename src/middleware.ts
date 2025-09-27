import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session data from cookies
  const userSession = request.cookies.get('userSession')?.value;
  const selectedEntity = request.cookies.get('selectedEntity')?.value;
  
  // Parse session data
  let sessionData = null;
  if (userSession) {
    try {
      sessionData = JSON.parse(decodeURIComponent(userSession));
    } catch (error) {
      console.error('Error parsing session data:', error);
    }
  }
  
  // Check if user is authenticated
  const isAuthenticated = sessionData && sessionData.user;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('returnUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and on login page, redirect to entity selection
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/entity-selection', request.url));
  }
  
  // If user is authenticated but hasn't selected entity and not on entity selection page
  if (isAuthenticated && !selectedEntity && pathname !== '/entity-selection' && !isPublicRoute) {
    return NextResponse.redirect(new URL('/entity-selection', request.url));
  }
  
  // If user has selected entity and is on entity selection page, redirect to dashboard
  if (isAuthenticated && selectedEntity && pathname === '/entity-selection') {
    return NextResponse.redirect(new URL('/human-resource', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
