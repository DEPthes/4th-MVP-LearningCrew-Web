// src/apis/Group/StudyGroupStep.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export type Attachment = {
 uuid: string;
 fileName: string;
 size: number;
 handlingType: string;
};

export type StepStudy = {
 step: number; // 1-based
 endDate?: string; // "YYYY-MM-DD"
 title: string;
 content: string; // html
 attachedFiles?: Attachment[]; // ✅ 추가
 attachedImages?: Attachment[]; // ✅ 추가
};

// ✅ 특정 스텝 조회 (미작성 404면 null)
export async function getStudyByStep(groupId: number, step: number) {
 try {
  const { data } = await axios.get<StepStudy>(
   `/api/study-groups/${groupId}/steps/${step}`
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
 title: string,
 content: string,
 newAttachedFiles?: File[],
 newAttachedImages?: File[],
 deletedAttachedImages?: string[],
 deletedAttachedFiles?: string[]
) {
 const headers = getAuthHeader();

 try {
  // 보통 최초 생성
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  newAttachedFiles?.forEach((file) =>
   formData.append("newAttachedFiles", file)
  );
  newAttachedImages?.forEach((image) =>
   formData.append("newAttachedImages", image)
  );
  deletedAttachedImages?.forEach((image) =>
   formData.append("deletedAttachedImages", image)
  );
  deletedAttachedFiles?.forEach((file) =>
   formData.append("deletedAttachedFiles", file)
  );

  const { data } = await axios.patch(
   `/api/study-groups/${groupId}/steps/${step}`,
   formData,
   { headers }
  );
  return data;
 } catch (error) {
  throw error;
 }
}
