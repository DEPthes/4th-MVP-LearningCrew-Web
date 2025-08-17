// src/apis/Group/Members.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";
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
 const { data } = await axios.get<PagedResponse<Member>>(
  `/api/study-groups/${groupId}/members`,
  { params: { page, size, sort } }
 );
 return data;
};

export const expelMember = async (groupId: number, userId: number) => {
 const res = await axios.delete(
  `/api/study-groups/${groupId}/members/${userId}`
 );
 return res.status;
};

//스터디 그룹 가입 신청 목록 조회
export const getMember = async (groupId: number) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${groupId}/applications`,
   {
    headers: getAuthHeader(),
   }
  );
  console.log(response.data);
  return response.data;
 } catch (error) {
  throw error;
 }
};

//가입 승인
export const ApproveMember = async (groupId: number, userId: number) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${groupId}/applications/${userId}/approve`,
   {},
   {
    headers: getAuthHeader(),
   }
  );
  console.log(response.data);
  return response.data;
 } catch (error) {
  throw error;
 }
};

//가입 거절
export const RejectMember = async (groupId: number, userId: number) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${groupId}/applications/${userId}/reject`,
   {},
   {
    headers: getAuthHeader(),
   }
  );
  console.log(response.data);
  return response.data;
 } catch (error) {
  throw error;
 }
};
