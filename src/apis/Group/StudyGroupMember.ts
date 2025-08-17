// src/apis/Group/StudyGroupMember.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";
import type { AppUser, PagedResponse } from "./StudyGroupApplication";

// 그룹 멤버 목록 조회
export const getGroupMembers = async (
  groupId: number,
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 50, sort = "createdAt,asc" } = opts ?? {};
  const { data } = await axios.get<PagedResponse<AppUser>>(
    `/api/study-groups/${groupId}/members`,
    { params: { page, size, sort }, headers: getAuthHeader() }
  );
  return data;
};

// 멤버 추방 (owner 권한 필요)
export const expelMember = async (groupId: number, userId: number) => {
  const res = await axios.delete(
    `/api/study-groups/${groupId}/members/${userId}`,
    { headers: getAuthHeader() }
  );
  return res.status; // 204 기대
};