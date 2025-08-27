import axios from 'axios';

// Use local API routes to avoid CORS issues
const API_BASE_URL = '/api/employees';

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
  createEmployee: async (employeeData: EmployeeData) => {
    try {
      console.log('Frontend API: Creating employee with data:', employeeData);
      console.log('Frontend API: Base URL:', apiClient.defaults.baseURL);
      console.log('Frontend API: Full URL will be:', `${apiClient.defaults.baseURL}`);
      
      const response = await apiClient.post('', employeeData);
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
      const response = await apiClient.get('');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        throw new Error(`API Error: ${errorMessage}`);
      }
      throw error;
    }
  },

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
