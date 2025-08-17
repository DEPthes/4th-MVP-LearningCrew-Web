import axios from "axios";
import api from "../common/client";                 
import { tokenStore } from "../common/token";
import type { Tokens } from "../common/token";

export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  profileImage?: { uuid: string; fileName: string } | null;
  profileImageUrl?: string | null;
};

type LoginResponse = Tokens | { token: Tokens };

export const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem("auth_tokens");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const token = parsed?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

export const hasAccessToken = () => {
  try {
    const raw = localStorage.getItem("auth_tokens");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.accessToken;
  } catch {
    return false;
  }
};

const USER_KEY = "auth_user";
export const userStore = {
  get(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  },
  set(user: UserProfile | null) {
    if (!user) {
      localStorage.removeItem(USER_KEY);
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(USER_KEY);
  },
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>(
    "/api/auth/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  const tokens: Tokens =
    (data as any)?.token ? ((data as any).token as Tokens) : (data as Tokens);

  tokenStore.set(tokens);

  try {
    const me = await fetchMyProfile();
    userStore.set(me || null);
  } catch {
    //
  }

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
  try {
    await api.post("/api/auth/logout");        
  } catch {
   //
  } finally {
    try { tokenStore.clear?.(); } catch {}
    try { userStore.clear?.(); } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  }
};

export const fetchMyProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data } = await api.get<UserProfile>("/api/users/me", {
      headers: { ...getAuthHeader() },
    });
    return data ?? null;
  } catch {
    return null;
  }
};
