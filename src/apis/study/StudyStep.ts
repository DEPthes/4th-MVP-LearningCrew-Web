import { api } from "../common/client";

export interface StepInfo {
  step: number;
  endDate: string;   // "YYYY-MM-DD"
  title: string;
  content: string;
}

/** 스텝 내용 조회 */
export const getStep = async (groupId: number, step: number) => {
  const { data } = await api.get<StepInfo>(`/api/study-groups/${groupId}/step/${step}`);
  return data;
};