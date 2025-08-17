// src/apis/Group/StudyGroupManage.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

/** 스터디 그룹 폐쇄(주최자 전용) */
export async function closeStudyGroup(groupId: number) {
  const res = await axios.delete(`/api/study-groups/${groupId}`, {
    headers: getAuthHeader(),
  });
  // 스펙상 204가 정상
  return res.status; // 204 기대
}