export type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: string;   // ISO Datetime
  refreshTokenExpiresAt?: string;  // ISO Datetime
};

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const ACCESS_EXP = "accessTokenExpiresAt";
const REFRESH_EXP = "refreshTokenExpiresAt";

function parseMs(v?: string | null): number | null {
  if (!v) return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : t;
}

export const tokenStore = {
  getAccess(): string {
    return localStorage.getItem(ACCESS) ?? "";
  },
  getRefresh(): string {
    return localStorage.getItem(REFRESH) ?? "";
  },
  getAccessExpMs(): number | null {
    return parseMs(localStorage.getItem(ACCESS_EXP));
  },
  getRefreshExpMs(): number | null {
    return parseMs(localStorage.getItem(REFRESH_EXP));
  },
  isAccessExpired(skewSec = 30): boolean {
    const exp = this.getAccessExpMs();
    if (!exp) return false; // 만료시간 없으면 체크 패스(서버가 안 줄 수도 있음)
    return Date.now() >= exp - skewSec * 1000;
  },
  isRefreshExpired(skewSec = 30): boolean {
    const exp = this.getRefreshExpMs();
    if (!exp) return false;
    return Date.now() >= exp - skewSec * 1000;
  },
  set(tokens: Tokens) {
    if (tokens.accessToken) localStorage.setItem(ACCESS, tokens.accessToken);
    if (tokens.refreshToken) localStorage.setItem(REFRESH, tokens.refreshToken);
    if (tokens.accessTokenExpiresAt) localStorage.setItem(ACCESS_EXP, tokens.accessTokenExpiresAt);
    if (tokens.refreshTokenExpiresAt) localStorage.setItem(REFRESH_EXP, tokens.refreshTokenExpiresAt);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(ACCESS_EXP);
    localStorage.removeItem(REFRESH_EXP);
  },
};