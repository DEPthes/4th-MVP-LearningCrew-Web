import { tokenStore } from "../common/token";
import type { Tokens } from "../common/token";
import axios from "axios";

export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  profileImage?: {
    uuid: string;
    fileName: string;
  } | null;
  profileImageUrl?: string | null;
};

type LoginResponse = Tokens | { token: Tokens };

export const login = async (email: string, password: string) => {
  const { data } = await axios.post<LoginResponse>(
    "/api/auth/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  const tokens: Tokens = (data as any)?.token ? ((data as any).token as Tokens) : (data as Tokens);
  tokenStore.set(tokens);

  try {
    const me = await fetchMyProfile();
    userStore.set(me || null);
  } catch {
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
  tokenStore.clear();
  userStore.clear();
};

export const nicknameConfirm = async (nickname: string) => {
  const { data } = await axios.get("/api/auth/nickname-exist", { params: { nickname } });
  return data;
};

export const getAuthHeader = () => {
  try {
    const authTokens = localStorage.getItem("auth_tokens");
    if (authTokens) {
      const parsed = JSON.parse(authTokens);
      const token = parsed.accessToken;
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  } catch (error) {
    console.error("토큰 파싱 실패:", error);
    return {};
  }
};

// 토큰 존재 여부 
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

// 유저 로컬 캐시 
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

// 내 정보 조회
export const fetchMyProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data } = await axios.get<UserProfile>("/api/users/me", {
      headers: {
        ...getAuthHeader(),
      },
    });
    return data ?? null;
  } catch (e) {
    return null;
  }
};
