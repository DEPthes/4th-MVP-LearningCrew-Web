// src/apis/common/client.ts
import axios, { AxiosError, AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "./token";
import type { Tokens } from "./token";

type RetryableConfig = InternalAxiosRequestConfig<any> & { _retry?: boolean };
type AnyHeaders = AxiosHeaders | Record<string, any> | undefined;

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const REFRESH_ENDPOINT = "/api/auth/token/refresh";
const SKEW_SEC = 30; // 만료 30초 전이면 미리 갱신

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

function setAuthHeader(headers: AnyHeaders, token: string): AnyHeaders {
  if (!headers) return { Authorization: `Bearer ${token}` } as Record<string, string>;
  const h = headers as any;
  if (typeof h.set === "function") {
    h.set("Authorization", `Bearer ${token}`);
    return headers;
  }
  return { ...(headers as Record<string, string>), Authorization: `Bearer ${token}` };
}

let isRefreshing = false;
let queue: Array<(t?: string) => void> = [];
const flush = (t?: string) => { queue.forEach((cb) => cb(t)); queue = []; };

async function refreshOnce(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      queue.push((newToken) => (newToken ? resolve(newToken) : reject(new Error("refresh failed"))));
    });
  }

  try {
    isRefreshing = true;

    if (tokenStore.isRefreshExpired(SKEW_SEC) || !tokenStore.getRefresh()) {
      throw new Error("refresh token missing/expired");
    }

    const { data } = await axios.post<Tokens>(
      `${BASE_URL}${REFRESH_ENDPOINT}`,
      { refreshToken: tokenStore.getRefresh() },
      { withCredentials: true }
    );
    tokenStore.set(data);
    flush(data.accessToken);
    return data.accessToken;
  } finally {
    isRefreshing = false;
  }
}

// 요청 인터셉터: 만료 임박 시 선(先)갱신 → Authorization 부착
api.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
  let at = tokenStore.getAccess();

  // access 없거나 만료 임박이면 먼저 갱신 시도
  if (!at || tokenStore.isAccessExpired(SKEW_SEC)) {
    try {
      at = await refreshOnce();
    } catch {
      // 갱신 실패 → 토큰 비움(혹은 그대로 두고 401에 맡김). 여기선 비워두자.
      tokenStore.clear();
      // 로그인 페이지로 보내고 싶으면 다음 줄 활성화
      // window.location.href = "/login";
    }
  }

  if (at) config.headers = setAuthHeader(config.headers as AnyHeaders, at) as any;
  return config;
});

// 응답 인터셉터: 401이면 백업 갱신 후 1회 재시도
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const newAt = await refreshOnce();
        original.headers = setAuthHeader(original.headers as AnyHeaders, newAt) as any;
        return api.request(original);
      } catch (e) {
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);