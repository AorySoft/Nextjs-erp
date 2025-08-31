import { NextResponse } from 'next/server';
import axios from 'axios';

const ERP_BASE_URL = 'https://erp.thebenchmark.com.pk/api';
const ERP_TOKEN = process.env.ERP_TOKEN;

export async function GET() {
  try {
    console.log('Server API: Fetching branches...');

    const response = await axios.get(`${ERP_BASE_URL}/resource/Branch`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `token ${ERP_TOKEN}`,
      },
      timeout: 10000,
    });

    console.log('Server API: Branches response:', response.data);

    if (response.data && response.data.data) {
      return NextResponse.json({
        success: true,
        data: response.data.data
      });
    } else {
      return NextResponse.json(
        { error: 'No branches found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Server API: Branches error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to fetch branches';
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch branches', 
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
