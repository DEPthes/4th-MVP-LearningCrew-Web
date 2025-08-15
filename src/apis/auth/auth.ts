// src/apis/auth/auth.ts
import { tokenStore } from "../common/token";
import type { Tokens } from "../common/token";
import axios from "axios"

// 서버가 토큰을 { accessToken, refreshToken? } 또는 { token: { ... } } 형태로 줄 수 있어 대비
type LoginResponse = Tokens | { token: Tokens };

export const login = async (email: string, password: string) => {
  const { data } = await axios.post<LoginResponse>(
    "/api/auth/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  const tokens: Tokens =
    (data as any)?.token ? ((data as any).token as Tokens) : (data as Tokens);

  tokenStore.set(tokens);
  return tokens;
};

export const refreshTokens = async (refreshToken: string) => {
  const { data } = await axios.post<Tokens>("/api/auth/token/refresh", {
    refreshToken,
  });
  tokenStore.set(data);
  return data;
};

export const logout = async () => {
  // 서버에 별도 로그아웃 엔드포인트 없다면 로컬만 정리
  tokenStore.clear();
};

export const nicknameConfirm = async (nickname: string) => {
  const { data } = await axios.get("/api/auth/nickname-exist", {
    params: { nickname },
  });
  return data;
};