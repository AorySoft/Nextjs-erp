import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api';
const API_TOKEN = process.env.NEXT_PUBLIC_ERP_TOKEN;

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Deleting shift assignment...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { assignment } = body;
    
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.post(`${API_BASE_URL}/method/delete_shift_type_and_related`, {
      assignment: assignment
    }, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Shift assignment deleted successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data
    });

  } catch (error: any) {
    console.error('API Route: Error deleting shift assignment:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to delete shift assignments.' },
        { status: 403 }
      );
    }
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Shift assignment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete shift assignment' },
      { status: 500 }
    );
  }
}
