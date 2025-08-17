// src/apis/common/client.ts
import axios from "axios";
import { tokenStore } from "./token";
// ❌ import { userStore } from "..//auth/auth";   // 제거 (순환 의존성 방지)

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

      // ✅ 토큰만 비우고 전역 이벤트 송출 (Navbar가 userStore를 비움)
      try { tokenStore.clear(); } catch {}

      window.dispatchEvent(new Event("auth:logout"));
      window.dispatchEvent(new Event("auth:tokenChanged"));

      setTimeout(() => {
        isLoggingOut = false;
      }, 500);
    }

    return Promise.reject(error);
  }
);

// 네 프로젝트가 default import를 쓰고 있으면 아래 유지
export default api;
// 만약 다른 파일에서 { api }로 불러온다면 위 줄 지우고: export { api };
