// src/apis/Group/StudyGroupStep.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export type Attachment = {
  id: number;          // 서버에서 관리하는 파일/이미지 ID
  name: string;        // 파일명
  url?: string;        // 미리보기/다운로드 URL (선택)
};

export type StepStudy = {
  step: number;       // 1-based
  endDate?: string;   // "YYYY-MM-DD"
  title: string;
  content: string;    // html
  fileList?: Attachment[];   // ✅ 추가
  imageList?: Attachment[];  // ✅ 추가
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

// ✅ 스텝 저장 (POST → PUT → PATCH 폴백 + 첨부목록 지원)
export async function saveStudyByStep(
  groupId: number,
  step: number,
  body: {
    endDate?: string;
    title: string;
    content: string;
    fileList?: Attachment[];   // ✅ 추가
    imageList?: Attachment[];  // ✅ 추가
  }
) {
  const headers = getAuthHeader();

  // 서버가 첨부를 ID 배열로 받는다면 여기서 매핑
  const payload = {
    ...body,
    fileIds: body.fileList?.map(f => f.id),
    imageIds: body.imageList?.map(i => i.id),
  };

  try {
    // 보통 최초 생성
    const { data } = await axios.post(
      `/api/study-groups/${groupId}/steps/${step}`,
      payload,
      { headers }
    );
    return data;
  } catch (e1: any) {
    // 이미 존재 → 전체 교체
    try {
      const { data } = await axios.put(
        `/api/study-groups/${groupId}/steps/${step}`,
        payload,
        { headers }
      );
      return data;
    } catch (e2: any) {
      // 부분 수정
      const { data } = await axios.patch(
        `/api/study-groups/${groupId}/steps/${step}`,
        payload,
        { headers }
      );
      return data;
    }
  }
}