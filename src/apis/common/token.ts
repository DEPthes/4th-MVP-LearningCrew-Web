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
   window.dispatchEvent(new Event("auth:tokenChanged"));
  } catch {
   // ignore
  }
 },
 clear() {
  try {
   localStorage.removeItem(STORAGE_KEY);
   window.dispatchEvent(new Event("auth:tokenChanged"));
  } catch {
   // ignore
  }
 },
};

export function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const { exp } = JSON.parse(atob(payload));
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true; 
  }
}