import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/human-resource',
];

// Define routes that require entity selection (excludes entity-selection page itself)
const entityRequiredRoutes = [
  '/',
  '/human-resource',
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/api',
];

// Routes that require authentication but not entity selection
const authOnlyRoutes = [
  '/entity-selection',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all API routes and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  const isAuthOnlyRoute = authOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  const isEntityRequiredRoute = entityRequiredRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute || isAuthOnlyRoute) {
    // Check for session in cookies or headers
    const userSessionCookie = request.cookies.get('userSession')?.value;
    const userSession = userSessionCookie ? decodeURIComponent(userSessionCookie) : 
                       request.headers.get('x-user-session');
    
    // If no session found, redirect to login
    if (!userSession) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session format (basic check)
    try {
      const session = JSON.parse(userSession);
      if (!session.user && !session.full_name) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      // Check session expiry
      if (session.loginTime) {
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        // 24-hour expiry check
        if (hoursDiff > 24) {
          const loginUrl = new URL('/login', request.url);
          return NextResponse.redirect(loginUrl);
        }
      }

      // For routes that require entity selection, check if entity is selected
      if (isEntityRequiredRoute) {
        const selectedEntityCookie = request.cookies.get('selectedEntity')?.value;
        let selectedEntity = null;
        
        if (selectedEntityCookie) {
          try {
            selectedEntity = JSON.parse(decodeURIComponent(selectedEntityCookie));
          } catch {
            // Invalid entity cookie format
          }
        }
        
        // If no entity is selected, redirect to entity selection
        if (!selectedEntity || !selectedEntity.name) {
          const entitySelectionUrl = new URL('/entity-selection', request.url);
          return NextResponse.redirect(entitySelectionUrl);
        }
      }
    } catch {
      // Invalid session format
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
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
