// src/apis/common/client.ts
import axios from "axios";
import { tokenStore } from "./token";

const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL, // dev: "", prod: "https://learnit.myunghyun.me"
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const tokens = tokenStore.get();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});