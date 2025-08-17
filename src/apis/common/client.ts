import axios from "axios";
import { tokenStore } from "./token";

const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const tokens = tokenStore.get();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// 401(만료/미인증)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        tokenStore.clear?.();
      } catch {}
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
