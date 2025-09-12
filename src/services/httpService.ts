// utils/httpService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:4200",
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
  (error) => Promise.reject(error)
);

// GET
async function get<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await axiosInstance.get(
    url,
    config
  );
  return response.data;
}

// POST
async function post<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await axiosInstance.post(
    url,
    data,
    config
  );
  return response.data;
}

// PUT
async function put<TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await axiosInstance.put(
    url,
    data,
    config
  );
  return response.data;
}

// DELETE
async function del<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await axiosInstance.delete(
    url,
    config
  );
  return response.data;
}

export const httpService = {
  get,
  post,
  put,
  delete: del,
};
