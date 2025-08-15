// src/apis/Group/StudyGroupApplication.ts
import { api } from "../common/client";

export type ApplicationState = "PENDING" | "APPROVED" | "REJECTED";

export interface AppUser {
  id: number;
  email: string;
  nickname: string;
  gender?: string;
}

export interface AppStudyGroup {
  id: number;
  name: string;
  maxMembers?: number;
  memberCount?: number;
}

export interface Application {
  user: AppUser;
  studyGroup: AppStudyGroup;
  createdAt: string;
  lastModifiedAt: string;
  approvedAt?: string;
  state: ApplicationState;
}

export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: PageMeta;
}

export const getGroupApplications = async (
  groupId: number,
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
  const { data } = await api.get<PagedResponse<Application>>(
    `/api/study-groups/${groupId}/applications`,
    { params: { page, size, sort } }
  );
  return data;
};

export const approveApplication = async (groupId: number, userId: number) => {
  const { data } = await api.post<Application>(
    `/api/study-groups/${groupId}/applications/${userId}/approve`
  );
  return data;
};

export const rejectApplication = async (groupId: number, userId: number) => {
  const { data } = await api.post<Application>(
    `/api/study-groups/${groupId}/applications/${userId}/reject`
  );
  return data;
};

export const applyToStudyGroup = async (groupId: number) => {
  const { data } = await api.post<Application>(`/api/study-groups/${groupId}/join`);
  return data;
};

export const cancelMyApplication = async (groupId: number) => {
  const { data } = await api.delete<Application>(`/api/study-groups/${groupId}/join`);
  return data;
};

export const leaveStudyGroup = async (groupId: number) => {
  const res = await api.delete(`/api/study-groups/${groupId}/leave`);
  return res.status;
};

export const getMyApplications = async (
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
  const { data } = await api.get<PagedResponse<Application>>(
    `/api/study-groups/my/applications`,
    { params: { page, size, sort } }
  );
  return data;
};

export const getMyApplicationForGroup = async (groupId: number) => {
  const paged = await getMyApplications({ size: 100 });
  return paged.content.find((a) => a.studyGroup.id === groupId) ?? null;
};