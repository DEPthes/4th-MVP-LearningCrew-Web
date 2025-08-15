// src/apis/auth/auth.ts
import { api } from "../common/client";
import { tokenStore } from "../common/token";
import type { Tokens } from "../common/token";

type LoginResponse = Tokens | { token: Tokens };

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>(
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
  const { data } = await api.post<Tokens>("/api/auth/token/refresh", { refreshToken });
  tokenStore.set(data);
  return data;
};

export const logout = async () => {
  tokenStore.clear();
};

export const nicknameConfirm = async (nickname: string) => {
  const { data } = await api.get("/api/auth/nickname-exist", { params: { nickname } });
  return data;
};