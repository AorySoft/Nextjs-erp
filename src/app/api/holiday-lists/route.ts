import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api';
const API_TOKEN = process.env.NEXT_PUBLIC_ERP_TOKEN;

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Fetching holiday lists...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${API_BASE_URL}/resource/Holiday List`, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      params: {
        fields: '["name","holiday_list_name","custom_payroll_period","custom_apply_on"]',
        limit: 100
      }
    });

    console.log('API Route: Holiday lists fetched successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data || []
    });

  } catch (error: any) {
    console.error('API Route: Error fetching holiday lists:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to Holiday List doctype.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch holiday lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Creating holiday list...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const response = await axios.post(`${API_BASE_URL}/resource/Holiday List`, body, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday list created successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data
    });

  } catch (error: any) {
    console.error('API Route: Error creating holiday list:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to create Holiday List.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create holiday list' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API Route: Updating holiday list...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Holiday list name is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const response = await axios.put(`${API_BASE_URL}/resource/Holiday List/${name}`, body, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday list updated successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data.data
    });

  } catch (error: any) {
    console.error('API Route: Error updating holiday list:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to update Holiday List.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update holiday list' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API Route: Deleting holiday list...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Holiday list name is required' },
        { status: 400 }
      );
    }
    
    const response = await axios.delete(`${API_BASE_URL}/resource/Holiday List/${name}`, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday list deleted successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data
    });

  } catch (error: any) {
    console.error('API Route: Error deleting holiday list:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to delete Holiday List.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete holiday list' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('API Route: Renaming holiday list...');
    
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { old_name, new_name } = body;
    
    if (!old_name || !new_name) {
      return NextResponse.json(
        { error: 'Old name and new name are required' },
        { status: 400 }
      );
    }
    
    const response = await axios.post(`${API_BASE_URL}/method/frappe.rename_doc`, {
      doctype: 'Holiday List',
      old: old_name,
      new: new_name
    }, {
      headers: {
        'Authorization': `token ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('API Route: Holiday list renamed successfully', response.data);
    
    return NextResponse.json({
      success: true,
      data: response.data
    });

  } catch (error: any) {
    console.error('API Route: Error renaming holiday list:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Your API token does not have access to rename Holiday List.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to rename holiday list' },
      { status: 500 }
    );
  }
}
