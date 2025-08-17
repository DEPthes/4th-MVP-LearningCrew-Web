import axios from "axios";
import { tokenStore } from "./token";
import { userStore } from "..//auth/auth";

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

let isLoggingOut = false; 

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      try {
        userStore.clear?.();
      } catch {}
      try {
        clearTokens?.();
      } catch {}

      window.dispatchEvent(new Event("auth:logout"));
      window.dispatchEvent(new Event("auth:tokenChanged"));

      setTimeout(() => {
        isLoggingOut = false;
      }, 500);
    }

    return Promise.reject(error);
  }
);
export default api;