import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api';
const API_TOKEN = process.env.NEXT_PUBLIC_ERP_TOKEN;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('API Route: Updating holiday period...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Holiday period ID is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.put(`${API_BASE_URL}/resource/Holiday/${id}`, body, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday period updated successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data
    });

  } catch (error: any) {
    console.error('API Route: Error updating holiday period:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to update Holiday.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update holiday period' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('API Route: Deleting holiday period...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Holiday period ID is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.delete(`${API_BASE_URL}/resource/Holiday/${id}`, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday period deleted successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data
    });

  } catch (error: any) {
    console.error('API Route: Error deleting holiday period:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to delete Holiday.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete holiday period' },
      { status: 500 }
    );
  }
}
