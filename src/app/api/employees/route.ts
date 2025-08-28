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
    // Token-based Authentication (as used by the ERP system)
    return {
      'Authorization': `token ${token}`
    };
  } else {
    // No authentication - this will likely fail
    console.warn('No ERP API token found in environment variables');
    return {};
  }
};

export async function GET() {
  try {
    console.log('Testing ERP API connection...');
    console.log('Auth headers:', getAuthHeaders());
    
    // Use the specific fields and limit as per your ERP API
    const response = await apiClient.get('/resource/Employee?fields=["name", "attendance_device_id","employee_name", "branch", "designation", "department", "cell_number", "custom_employment_category","employment_type"]&limit=false', {
      headers: getAuthHeaders()
    });
    
    console.log('ERP API GET response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching employees:', error);
    if (axios.isAxiosError(error)) {
      console.error('ERP API GET Error Response:', error.response?.data);
      console.error('ERP API GET Error Status:', error.response?.status);
    }
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received form data:', JSON.stringify(body, null, 2));
    
    // Helper function to convert date format if needed
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      // If date is in MM/DD/YYYY format, convert to YYYY-MM-DD
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }
      // If already in YYYY-MM-DD format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      return dateString;
    };
    
    // Clean up - remove unused employeeData object
    console.log('Auth headers:', getAuthHeaders());

    // Validate mandatory fields
    if (!body.first_name || !body.gender || !body.date_of_birth || !body.custom_cnic || 
        !body.custom_employment_category || !body.department || !body.employment_type || 
        !body.date_of_joining) {
      return NextResponse.json(
        { error: 'Missing mandatory fields. Required: first_name, gender, date_of_birth, custom_cnic, custom_employment_category, department, employment_type, date_of_joining' },
        { status: 400 }
      );
    }

    // Use the exact field names and format that the ERP API expects
    const erpEmployeeData = {
      name: body.first_name || `tbm${Date.now()}`, // Generate unique employee ID
      first_name: body.first_name,
      gender: body.gender.charAt(0).toUpperCase() + body.gender.slice(1).toLowerCase(),
      date_of_birth: formatDate(body.date_of_birth),
      custom_cnic: body.custom_cnic,
      custom_employment_category: body.custom_employment_category,
      company: body.company || 'The Benchmark',
      department: body.department,
      employment_type: body.employment_type,
      date_of_joining: formatDate(body.date_of_joining),
      attendance_device_id: body.attendance_device_id || ''
    };

    console.log('Sending to ERP API with exact field names:', JSON.stringify(erpEmployeeData, null, 2));
    console.log('ERP API URL:', `${API_BASE_URL}/resource/Employee`);
    console.log('Request headers:', getAuthHeaders());

    const response = await apiClient.post('/resource/Employee', erpEmployeeData, {
      headers: getAuthHeaders()
    });
    
    console.log('ERP API Success Response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (axios.isAxiosError(error)) {
      console.error('ERP API Response:', error.response?.data);
      console.error('ERP API Status:', error.response?.status);
      console.error('ERP API Headers:', error.response?.headers);
      
      return NextResponse.json(
        { 
          error: 'Failed to create employee',
          details: error.response?.data || error.message,
          status: error.response?.status,
          headers: error.response?.headers
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, ...employeeData } = body;
    
    const response = await apiClient.put(`/resource/Employee/${employeeId}`, employeeData, {
      headers: getAuthHeaders()
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating employee:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: 'Failed to update employee',
          details: error.response?.data || error.message 
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('id');
    
    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    const response = await apiClient.delete(`/resource/Employee/${employeeId}`, {
      headers: getAuthHeaders()
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error deleting employee:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: 'Failed to delete employee',
          details: error.response?.data || error.message 
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
