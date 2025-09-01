import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://erp.thebenchmark.com.pk/api';

// Create axios instance for server-side requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Get authentication credentials from environment variables
const getAuthHeaders = () => {
  const token = process.env.ERP_TOKEN;
  
  if (token) {
    return {
      'Authorization': `token ${token}`
    };
  }
  
  throw new Error('ERP_TOKEN not found in environment variables');
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    
    console.log('Server API: Fetching Employment Type from ERP...');
    
    const authHeaders = getAuthHeaders();
    
    const response = await apiClient.get(`/resource/Employment Type?limit=${limit}`, {
      headers: {
        ...authHeaders,
      },
    });
    
    console.log('Server API: Successfully fetched Employment Type');
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Server API: Error fetching Employment Type:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch Employment Type', 
          details: message,
          status: status 
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
