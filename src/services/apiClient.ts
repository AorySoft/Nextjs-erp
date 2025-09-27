import axios, { AxiosRequestConfig } from "axios";

// Base URL for ERP
const apiClient = axios.create({
  baseURL: "https://erp.thebenchmark.com.pk/api", // ✅ your base
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Expect": "", // 👈 prevent 417 error
  },
  // Remove default timeout to allow for longer timeouts when specified in individual requests
  timeout: 600000, // 10 minutes default timeout
});

// Attach auth token automatically (ERPNext expects token key:secret)
apiClient.interceptors.request.use((config) => {
    const token = process.env.NEXT_PUBLIC_ERP_TOKEN; // 👈 you stored key:secret here
    if (token) {
      config.headers.Authorization = `token ${token}`;
    }
  
    return config;
  });
  
// Generic request methods
const request = {
  get: async <T>(url: string, params?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.get<T>(url, { params, ...config });
    return res.data;
  },
  getByBody: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.post<T>(url, data, config);
    return res.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.post<T>(url, data, config);
    return res.data;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.patch<T>(url, data, config);
    return res.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const res = await apiClient.delete<T>(url, config);
    return res.data;
  },
  deleteBody: async <T>(url: string,body?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.delete<T>(url, config);
    return res.data;
  },
  update: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const res = await apiClient.put<T>(url, data, config);
    return res.data;
  },
};

export default request;