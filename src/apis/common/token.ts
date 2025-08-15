// src/apis/common/token.ts

// 서버가 내려주는 토큰 형태에 맞춰 사용
export type Tokens = {
  accessToken: string;
  refreshToken?: string;
};

const STORAGE_KEY = "auth_tokens";

export const tokenStore = {
  get(): Tokens | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Tokens) : null;
    } catch {
      return null;
    }
  },
  set(tokens: Tokens) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // ignore
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};