import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Use local API routes to avoid CORS issues
const API_BASE_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});


export interface EmployeeData {
  name?: string;
  gender?: string;
  date_of_birth?: string;
  custom_cnic?: string;
  custom_employment_category?: string;
  company?: string;
  department?: string;
  employment_type?: string;
  date_of_joining?: string;
  attendance_device_id?: string;
  first_name?: string;
  last_name?: string;
  short_code?: string;
  machine_code?: string;
  marital_status?: string;
  blood_group?: string;
  religion?: string;
  nationality?: string;
  birth_country?: string;
  birth_city?: string;
  contact_no?: string;
  whatsapp_no?: string;
  email?: string;
  caste?: string;
  // Additional employment fields
  appointment_date?: string;
  employee_grade?: string;
  designation?: string;
  status?: string;
  reporting_to?: string;
  site?: string;
}

export const employeeAPI = {
  createEmployee: async (employeeData: string) => {
    try {
      console.log('Frontend API: Creating employee with data:', employeeData);
      console.log('Frontend API: Base URL:', apiClient.defaults.baseURL);
      console.log('Frontend API: Full URL will be:', `${apiClient.defaults.baseURL}`);
      
      const response = await apiClient.post(`${apiClient.defaults.baseURL}/resource/Employee${employeeData}`,{});
      console.log('Frontend API: Success response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error creating employee:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend API: Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  updateEmployee: async (employeeId: string, employeeData: EmployeeData) => {
    try {
      const response = await apiClient.put('', { employeeId, ...employeeData });
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  getEmployees: async () => {
    try {

      
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/employees?fields=["name", "attendance_device_id","employee_name", "branch", "designation", "department", "cell_number", "custom_employment_category","employment_type"]&limit=false');
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error fetching employees:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend API: Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },


  // getting designation
  getDesignation: async () => {
    try {
    
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/resource/designation?limit=100');
      console.log('Designation', response.data);
      return response?.data;
    } catch (error) {
      console.error('Frontend API: Error fetching designation:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend API: Axios error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL
        });
        const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  // getting department
  getDepartment: async () => {
    try {
      
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/resource/department?limit=100');
      console.log('Department', response.data);
      return response?.data;
    } catch (error) {
      console.error('Frontend API: Error fetching department:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend API: Axios error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL
        });
        const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  //
getEmploymentType: async () => {
  try {
    // Use the specific fields and limit as per your ERP API
    const response = await apiClient.get('/resource/employment-type?limit=100');
    console.log('Employment Type', response.data);
    return response?.data;
  } catch (error) {
    console.error('Frontend API: Error fetching employment type:', error);
    if (axios.isAxiosError(error)) {
      console.error('Frontend API: Axios error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL
      });
      const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
      throw new Error(`API Error: ${errorMessage}`);
    }
    throw error;
  }
},

  //
  // Additional helper methods
  deleteEmployee: async (employeeId: string) => {
    try {
      const response = await apiClient.delete(`?id=${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  getEmployeeById: async (employeeId: string) => {
    try {
      const response = await apiClient.get(`?id=${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  }
};

// Test API connectivity
export const testAPI = {
  testConnection: async () => {
    try {
      // Test with a basic endpoint that should be accessible
      const response = await apiClient.get('/method/frappe.auth.get_logged_user');
      console.log('API Test - Logged User:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Test - Connection failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Test - Error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
        });
      }
      throw error;
    }
  },

  testUserPermissions: async () => {
    try {
      // Test with User doctype which should be accessible
      const response = await apiClient.get('/resource/User?fields=["name","full_name","email"]&limit=1');
      console.log('API Test - User access:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Test - User access failed:', error);
      throw error;
    }
  }
};

// Holiday List API
export const holidayListAPI = {
  getHolidayLists: async () => {
    try {
      const response = await apiClient.get(`${process.env.NEXT_PUBLIC_API_URL}/resource/Holiday List?fields=["name","holiday_list_name","custom_payroll_period","custom_apply_on"]`);
      console.log('Holiday Lists', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error fetching holiday lists:', error);
      if (axios.isAxiosError(error)) {
        console.error('Frontend API: Axios error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL
        });
        
        // Handle specific permission errors
        if (error?.response?.status === 403 || error?.response?.data?.exception === 'frappe.exceptions.PermissionError') {
          throw new Error('Permission Error: Your API token does not have access to Holiday List. Please check your ERPNext user permissions.');
        }
        
        const errorMessage = error?.response?.data?._error_message || error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  createHolidayList: async (holidayData: any) => {
    try {
      const response = await apiClient.post('/resource/Holiday List', holidayData);
      console.log('Holiday List Created', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error creating holiday list:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  updateHolidayList: async (name: string, holidayData: any) => {
    try {
      const response = await apiClient.put(`/resource/Holiday List/${name}`, holidayData);
      console.log('Holiday List Updated', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error updating holiday list:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

  deleteHolidayList: async (name: string) => {
    try {
      const response = await apiClient.delete(`/resource/Holiday List/${name}`);
      console.log('Holiday List Deleted', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API: Error deleting holiday list:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error?.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  }
};



