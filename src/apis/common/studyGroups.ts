import axios from "axios";
import { getAuthHeader } from "../auth/auth";

function readStoredToken(): string | null {
  const keys = [
    "accessToken",
    "access_token",
    "Authorization",
    "authorization",
    "token",
    "jwt",
  ];
  let raw: string | null = null;

  for (const k of keys) {
    raw = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (raw) break;
  }
  if (!raw && typeof document !== "undefined") {
    const m = document.cookie.match(
      /(?:^|;\s*)(accessToken|access_token|Authorization|authorization)=([^;]+)/
    );
    if (m) raw = decodeURIComponent(m[2]);
  }
  if (!raw) return null;

  if (raw.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(raw);
      raw = obj?.accessToken || obj?.access_token || obj?.token || obj?.jwt || "";
    } catch {/* */}
  }
  if (!raw) return null;

  const m = raw.match(/([A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+)/);
  return m ? m[1] : raw.replace(/^Bearer\s+/i, "");
}

//타입
export type SortKey = "created_at" | "relative" | "alphabet";
export type Order = "asc" | "desc";

export type FileMeta = {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
};

export type StudyGroupCategory = { id: number; name: string };

export type StudyGroupOwner = {
  id: number;
  email: string;
  nickname: string;
  role: string;
  gender: "MALE" | "FEMAIL" | "OTHER" | string;
  profileImage?: FileMeta | null;
  createdAt: string;
  lastModifiedAt: string;
};

export type StudyGroupItem = {
  id: number;
  name: string;
  summary: string;
  maxMembers: number;
  groupImage?: FileMeta | null;
  categories: StudyGroupCategory[];
  memberCount: number;
  dibs: boolean;
  startDate: string;
  endDate: string;
  owner: StudyGroupOwner;
  createdAt: string;
  lastModifiedAt: string;
};

export type PageMeta = {
  size: number;
  number: number;
  totalElements: number | string;
  totalPages: number | string;
};

export type StudyGroupsResponse = {
  content: StudyGroupItem[];
  page: PageMeta;
};

export type FetchStudyGroupsParams = {
  sort?: SortKey;
  order?: Order;
  categoryId?: number;
  searchKeyword?: string;
  page?: number;
  size?: number;
};

//유틸 쿼리 
function qs(params: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

//목록 조회 (비인증)
export async function fetchStudyGroups(params: FetchStudyGroupsParams = {}) {
  const {
    sort = "created_at",
    order = "desc",
    categoryId,
    searchKeyword,
    page = 0,
    size = 12,
  } = params;

  const query = qs({ sort, order, categoryId, searchKeyword, page, size });
  const url = `/api/study-groups${query}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as StudyGroupsResponse;
}

//상세조회
export type StudyGroupDetail = {
  id: number;
  name: string;
  summary: string | null;
  maxMembers: number;
  groupImage?: {
    uuid: string;
    fileName: string;
    size: number;
    handlingType: "IMAGE" | "DOWNLOADABLE";
  } | null;
  categories: { id: number; name: string }[];
  memberCount: number;
  dibs: boolean;
  startDate: string;
  endDate: string;
  owner: {
    id: number;
    email: string;
    nickname: string;
    role: string;
    gender: string;
    profileImage?: {
      uuid: string;
      fileName: string;
      size: number;
      handlingType: "IMAGE" | "DOWNLOADABLE";
    } | null;
    createdAt: string;
    lastModifiedAt: string;
  };
  createdAt: string;
  lastModifiedAt: string;
  steps: { step: number; endDate: string; title: string; content: string }[];
  currentStep: number;
};

export async function fetchStudyGroup(id: number): Promise<StudyGroupDetail> {
  const { data } = await axios.get(`/api/study-groups/${id}`, {
    headers: getAuthHeader(),
  });
  return data as StudyGroupDetail;
}
