import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    // Call the external logout API
    const response = await axios.post(
      'https://erp.thebenchmark.com.pk/api/method/logout',
      {},
      {
        headers: {
          'Cookie': `sid=${sessionToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Create response to clear all session-related cookies
    const logoutResponse = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear all authentication cookies
    logoutResponse.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    logoutResponse.cookies.set('user_data', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    logoutResponse.cookies.set('selectedEntity', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return logoutResponse;

  } catch (error: unknown) {
    console.error('Logout error:', error);
    
    // Even if external logout fails, clear local session
    const errorResponse = NextResponse.json(
      { message: 'Logged out locally (external logout may have failed)' },
      { status: 200 }
    );

    // Clear cookies anyway
    errorResponse.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    errorResponse.cookies.set('user_data', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    errorResponse.cookies.set('selectedEntity', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return errorResponse;
  }
}
