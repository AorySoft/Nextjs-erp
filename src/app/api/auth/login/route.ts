import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ERP_BASE_URL = 'https://erp.thebenchmark.com.pk/api';

export async function POST(request: NextRequest) {
  try {
    const { usr, pwd } = await request.json();

    if (!usr || !pwd) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Server API: Attempting login for user:', usr);

    const response = await axios.post(`${ERP_BASE_URL}/method/login`, {
      usr,
      pwd,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    console.log('Server API: Login response:', response.data);

    if (response.data.message === "Logged In") {
      // Extract comprehensive session data from ERP response
      const sessionData = {
        message: response.data.message,
        user: response.data.user || usr,
        full_name: response.data.full_name,
        email: response.data.email,
        token: response.data.token,
        sid: response.data.sid,
        session_id: response.data.session_id,
        home_page: response.data.home_page,
        // Include any cookies or session info
        cookies: response.headers['set-cookie'],
        // Add timestamp
        loginTime: new Date().toISOString(),
        // Include all other response data
        ...response.data
      };

      return NextResponse.json(sessionData);
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Server API: Login error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Login failed';
      
      if (status === 401) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Login failed', 
          details: message 
        },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
