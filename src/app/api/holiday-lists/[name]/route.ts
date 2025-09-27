import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api';
const API_TOKEN = process.env.NEXT_PUBLIC_ERP_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    console.log('API Route: Fetching holiday list details...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { name } = params;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Holiday list name is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.get(`${API_BASE_URL}/resource/Holiday List/${encodeURIComponent(name)}`, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday list details fetched successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data
    });

  } catch (error: any) {
    console.error('API Route: Error fetching holiday list details:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to view Holiday List details.' },
        { status: 403 }
      );
    }
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Holiday list not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch holiday list details' },
      { status: 500 }
    );
  }
}
