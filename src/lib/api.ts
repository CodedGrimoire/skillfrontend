import axios, { AxiosRequestConfig, AxiosResponse, type AxiosRequestHeaders } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
if (typeof window !== "undefined") {
  console.log("API Base URL:", baseURL);
}

const api = axios.create({
  baseURL,
});

// Attach JWT token from localStorage when available (client side only).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      // Preserve existing headers object to satisfy Axios' expected type
      config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
      (config.headers as AxiosRequestHeaders)["Authorization"] = `Bearer ${token}`;
      console.log("🔍 [API] Request interceptor: Token attached to", config.url);
    } else {
      console.warn("🔍 [API] Request interceptor: No token found for", config.url);
    }
  }
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("🔍 [API] Response:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("🔍 [API] Error:", error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

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
