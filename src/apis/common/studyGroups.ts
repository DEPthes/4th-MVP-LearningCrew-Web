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

function qs(params: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function fetchStudyGroups(params: FetchStudyGroupsParams = {}) {
  const {
    sort = "created_at",
    order = "desc",
    categoryId,
    searchKeyword,
    page = 0,
    size = 12,
  } = params;

  const query = qs({
    sort,
    order,
    categoryId,
    searchKeyword,
    page,
    size,
  });

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