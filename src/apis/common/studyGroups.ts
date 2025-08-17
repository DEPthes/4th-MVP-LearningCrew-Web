import axios from "axios";
import { getAuthHeader } from "../auth/auth";

// 정렬 타입
export type SortOrder = "asc" | "desc";
export type SortKey = "createdAt" | "startDate" | "endDate" | "memberCount" | "name";

export interface StudyGroupCategory {
  id: number;
  name: string;
}

export interface FileMeta {
  uuid: string;
  fileName: string;
  size?: number;
  handlingType?: string;
}

export interface StudyGroupOwner {
  id: number;
  nickname: string;
  email?: string;
  role?: string;
  gender?: "MALE" | "FEMAIL" | "OTHER" | string;
  profileImage?: FileMeta | null;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface StudyGroupItem {
  id: number;
  name: string;
  summary?: string | null;
  startDate: string;
  endDate: string;
  memberCount: number;
  maxMembers: number;
  categories?: StudyGroupCategory[];
  owner?: StudyGroupOwner | null;
  dibs?: boolean;
  groupImage?: FileMeta | null;
}

export interface StudyGroupStep {
  step: number;
  title?: string | null;
  content?: string | null;
  endDate?: string;
}

export interface StudyGroupDetail extends StudyGroupItem {
  createdAt?: string;
  lastModifiedAt?: string;
  currentStep: number;
  steps?: StudyGroupStep[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 스터디 그룹 목록 조회
export async function fetchStudyGroups(params: {
  sort?: SortKey;
  order?: SortOrder;
  categoryId?: number;
  searchKeyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<StudyGroupItem>> {
  const {
    sort = "createdAt",
    order = "desc",
    categoryId,
    searchKeyword,
    page = 0,
    size = 12,
  } = params;

  const qs = new URLSearchParams();
  if (sort) qs.set("sort", sort);
  if (order) qs.set("order", order);
  if (categoryId !== undefined) qs.set("categoryId", String(categoryId));
  if (searchKeyword) qs.set("searchKeyword", searchKeyword);
  qs.set("page", String(page));
  qs.set("size", String(size));

  const { data } = await axios.get<PageResponse<StudyGroupItem>>(
    `/api/study-groups?${qs.toString()}`,
    { headers: getAuthHeader() }
  );
  return data;
}

// 스터디 그룹 상세 조회
export async function fetchStudyGroup(groupId: number): Promise<StudyGroupDetail> {
  const { data } = await axios.get<StudyGroupDetail>(`/api/study-groups/${groupId}`, {
    headers: getAuthHeader(),
  });
  return data;
}