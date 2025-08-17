// src/apis/Group/StudyGroupDibs.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

/** 찜 토글: true면 찜됨, false면 해제됨 */
export const toggleGroupDibs = async (groupId: number): Promise<boolean> => {
  const { data } = await axios.post<{ dibs: boolean }>(
    `/api/study-groups/${groupId}/dibs`,
    null,
    { headers: getAuthHeader() }
  );
  return Boolean(data?.dibs);
};