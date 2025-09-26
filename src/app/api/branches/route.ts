import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api';
const API_TOKEN = process.env.NEXT_PUBLIC_ERP_TOKEN;

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Fetching branches...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${API_BASE_URL}/resource/Company`, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      params: {
        fields: '["name","company_name","abbr","default_currency"]',
        limit: 100
      }
    });

    console.log('API Route: Branches fetched successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data || []
    });

  } catch (error: any) {
    console.error('API Route: Error fetching branches:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Please check your API token permissions.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}
