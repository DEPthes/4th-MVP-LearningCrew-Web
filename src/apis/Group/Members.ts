// src/apis/Group/Members.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";
import type { PagedResponse } from "./StudyGroupApplication";

/** 참여자 한 명 */
export interface Member {
  user: { id: number; email: string; nickname: string; gender?: string };
  createdAt: string; // 가입일자
}

/**
 * 참여자 목록 조회
 * GET /api/study-groups/{groupId}/members
 */
export const getGroupMembers = async (
  groupId: number,
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
  const { data } = await axios.get<PagedResponse<Member>>(
    `/api/study-groups/${groupId}/members`,
    {
      params: { page, size, sort },
      headers: getAuthHeader(), // ✅ 인증 헤더 추가
    }
  );
  return data;
};

/**
 * 참여자 강퇴
 * DELETE /api/study-groups/{groupId}/members/{userId}
 */
export const expelMember = async (groupId: number, userId: number) => {
  const res = await axios.delete(
    `/api/study-groups/${groupId}/members/${userId}`,
    { headers: getAuthHeader() } // ✅ 인증 헤더 추가
  );
  return res.status;
};

/**
 * 스터디 그룹 가입 신청 목록 조회(주최자용)
 * GET /api/study-groups/{groupId}/applications
 * - 사용처에서 타입 구체화 필요하면 PagedResponse<Application>으로 교체 가능
 */
export const getMember = async (groupId: number) => {
  try {
    const response = await axios.get(
      `/api/study-groups/${groupId}/applications`,
      { headers: getAuthHeader() } // ✅ 인증 헤더 유지
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 가입 승인(주최자용)
 * POST /api/study-groups/{groupId}/applications/{userId}/approve
 */
export const ApproveMember = async (groupId: number, userId: number) => {
  try {
    const response = await axios.post(
      `/api/study-groups/${groupId}/applications/${userId}/approve`,
      {},
      { headers: getAuthHeader() } // ✅ 인증 헤더 유지
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 가입 거절(주최자용)
 * POST /api/study-groups/{groupId}/applications/{userId}/reject
 */
export const RejectMember = async (groupId: number, userId: number) => {
  try {
    const response = await axios.post(
      `/api/study-groups/${groupId}/applications/${userId}/reject`,
      {},
      { headers: getAuthHeader() } // ✅ 인증 헤더 유지
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};