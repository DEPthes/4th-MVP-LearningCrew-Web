import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export type SortOrder = "asc" | "desc";

export type SortKey = "createdAt" | "startDate" | "endDate" | "memberCount" | "name";
export type Order = SortOrder;

export interface StudyGroupCategory {
  id: number;
  name: string;
}

export interface StudyGroupOwner {
  id: number;
  nickname: string;
  profileImage?: {
    uuid: string;
    fileName: string;
  } | null;
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
  groupImage?: {
    uuid: string;
    fileName: string;
  } | null;
}

export interface StudyGroupStep {
  step: number;
  title?: string | null;
  content?: string | null;
}

export interface StudyGroupDetail extends StudyGroupItem {
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

export async function fetchStudyGroup(groupId: number): Promise<StudyGroupDetail> {
  const { data } = await axios.get<StudyGroupDetail>(`/api/study-groups/${groupId}`, {
    headers: getAuthHeader(),
  });
  return data;
}
