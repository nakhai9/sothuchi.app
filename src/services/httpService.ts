// utils/httpService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Tạo Axios instance mặc định
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axiosInstance.get(url, config);
  return response.data;
}

async function post<T>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await axiosInstance.post(
    url,
    data,
    config
  );
  return response.data;
}

async function put<T>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
  return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
  return response.data;
}

export const httpService = {
  get,
  post,
  put,
  delete: del,
};
