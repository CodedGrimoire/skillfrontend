import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT token from localStorage when available (client side only).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

type Config = AxiosRequestConfig;

export const get = <T = unknown>(url: string, config?: Config): Promise<AxiosResponse<T>> =>
  api.get<T>(url, config);

export const post = <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Config,
): Promise<AxiosResponse<T>> => api.post<T>(url, body, config);

export const put = <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Config,
): Promise<AxiosResponse<T>> => api.put<T>(url, body, config);

export const patch = <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: Config,
): Promise<AxiosResponse<T>> => api.patch<T>(url, body, config);

export default api;
