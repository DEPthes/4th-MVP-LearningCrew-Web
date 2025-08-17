// src/apis/common/client.ts
import axios from "axios";
import { tokenStore } from "./token";

// ✅ 요청 인터셉터: 토큰 자동 첨부
axios.interceptors.request.use((config) => {
  const tokens = tokenStore.get();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// ✅ 응답 인터셉터: 401 처리(토큰 제거 + 전역 이벤트)
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try { tokenStore.clear?.(); } catch {}
      if (typeof window !== "undefined") {
        // MyPage 등에서 듣는 이벤트
        window.dispatchEvent(new CustomEvent("auth:logout"));
        // 토큰 변화에 반응하는 컴포넌트가 있다면 추가
        window.dispatchEvent(new CustomEvent("auth:tokenChanged"));
      }
    }
    return Promise.reject(error);
  }
);

// ⛔️ api 인스턴스 사용 안 함 (export 제거)
