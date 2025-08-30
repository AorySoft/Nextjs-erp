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
      console.log('Frontend API: Fetching employees...');
      console.log('Frontend API: Base URL:', apiClient.defaults.baseURL);
      console.log('Frontend API: Full URL will be:', `${apiClient.defaults.baseURL}`);
      
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/employees?fields=["name", "attendance_device_id","employee_name", "branch", "designation", "department", "cell_number", "custom_employment_category","employment_type"]&limit=false');
      console.log('Frontend API: Success response:', response.data);
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
      console.log('Frontend API: Fetching designation...');
      console.log('Frontend API: Base URL:', apiClient.defaults.baseURL);
      console.log('Frontend API: Full URL will be:', `${apiClient.defaults.baseURL}`);
      
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/resource/designation?limit=100');
      console.log('Frontend API: Success response:', response.data);
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
      console.log('Frontend API: Fetching department...');
      console.log('Frontend API: Base URL:', apiClient.defaults.baseURL);
      console.log('Frontend API: Full URL will be:', `${apiClient.defaults.baseURL}`);
      
      // Use the specific fields and limit as per your ERP API
      const response = await apiClient.get('/resource/department?limit=100');
      console.log('Frontend API: Success response:', response.data);
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



//// new method for api calls
// Generic request handler (optional, helps with typing + error handling)
const request = async <T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error?.response || error);
    throw error?.response?.data || error;
  }
};

// Export helpers
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("get", url, undefined, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("post", url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("put", url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("patch", url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("delete", url, undefined, config),
};