// src/apis/Group/Members.ts
import { api } from "../common/client";
import type { PagedResponse } from "./StudyGroupApplication";

export interface Member {
  user: { id: number; email: string; nickname: string; gender?: string };
  createdAt: string;
}

export const getGroupMembers = async (
  groupId: number,
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
  const { data } = await api.get<PagedResponse<Member>>(
    `/api/study-groups/${groupId}/members`,
    { params: { page, size, sort } }
  );
  return data;
};

export const expelMember = async (groupId: number, userId: number) => {
  const res = await api.delete(`/api/study-groups/${groupId}/members/${userId}`);
  return res.status;
};