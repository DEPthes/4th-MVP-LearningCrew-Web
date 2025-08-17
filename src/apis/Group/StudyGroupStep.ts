// 스텝별 스터디 조회 API
import { api } from "../common/client";

export interface StepStudy {
  step: number;       // 1-based
  endDate: string;    // "YYYY-MM-DD"
  title: string;
  content: string;
}

export async function getStudyByStep(groupId: number, step: number) {
  // step은 1-based 그대로 전달
  const { data } = await api.get<StepStudy>(`/api/study-groups/${groupId}/steps/${step}`);
  return data;
}