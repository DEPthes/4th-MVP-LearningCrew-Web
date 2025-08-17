// src/apis/Group/StudyGroupStep.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export type StepStudy = {
  step: number;       // 1-based
  endDate?: string;   // "YYYY-MM-DD"
  title: string;
  content: string;    // html
};

// ✅ 특정 스텝 조회 (미작성 404면 null)
export async function getStudyByStep(groupId: number, step: number) {
  try {
    const { data } = await axios.get<StepStudy>(
      `/api/study-groups/${groupId}/steps/${step}`,
      { headers: getAuthHeader() }
    );
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

// ✅ 스텝 저장 (서버 메서드 스펙 차이 대비: POST → PUT → PATCH 폴백)
export async function saveStudyByStep(
  groupId: number,
  step: number,
  body: { endDate?: string; title: string; content: string }
) {
  const headers = { ...getAuthHeader() }; // axios가 JSON은 자동으로 Content-Type 지정

  // 1) POST /api/study-groups/{groupId}/steps  (payload에 step 포함)
  try {
    const { data } = await axios.post<StepStudy>(
      `/api/study-groups/${groupId}/steps`,
      { step, ...body },
      { headers }
    );
    return data;
  } catch (e: any) {
    const status = e?.response?.status;

    // 405/404면 2) PUT /api/study-groups/{groupId}/steps/{step} 시도
    if (status === 405 || status === 404) {
      try {
        const { data } = await axios.put<StepStudy>(
          `/api/study-groups/${groupId}/steps/${step}`,
          body,
          { headers }
        );
        return data;
      } catch (e2: any) {
        const st2 = e2?.response?.status;

        // 여전히 405면 3) PATCH 시도
        if (st2 === 405) {
          const { data } = await axios.patch<StepStudy>(
            `/api/study-groups/${groupId}/steps/${step}`,
            body,
            { headers }
          );
          return data;
        }
        throw e2;
      }
    }

    throw e;
  }
}