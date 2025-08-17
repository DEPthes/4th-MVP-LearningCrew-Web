// src/apis/Group/StudyGroupApplication.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

/** ---------------------------
 *  타입 정의 (백엔드 스키마 기준)
 *  --------------------------- */

// 파일 메타
export interface FileMeta {
 uuid: string;
 fileName: string;
 size?: number;
 handlingType?: "IMAGE" | "DOWNLOADABLE" | string;
}

// 사용자
export interface AppUser {
 id: number;
 email: string;
 nickname: string;
 role?: "USER" | string;
 gender?: "MALE" | "FEMAIL" | "OTHER" | string; // ※ 서버 스펙에 FEMAIL 철자 그대로 유지
 profileImage?: FileMeta | null;
 createdAt?: string; // ISO Datetime
 lastModifiedAt?: string; // ISO Datetime
}

// 카테고리
export interface AppCategory {
 id: number;
 name: string;
}

// 그룹 썸네일 등
export interface AppGroupImage extends FileMeta {}

// 스터디 그룹 (응답에서 오는 필드들을 모두 포함)
export interface AppStudyGroup {
 id: number;
 name: string;
 summary?: string | null;
 maxMembers?: number;
 groupImage?: AppGroupImage | null;
 categories?: AppCategory[];
 memberCount?: number;
 dibs?: boolean;
 startDate?: string; // "YYYY-MM-DD"
 endDate?: string; // "YYYY-MM-DD"
 owner?: AppUser;
 createdAt?: string; // "2024-01-01T00:00:00"
 lastModifiedAt?: string; // "2024-01-01T00:00:00"
}

// 신청 상태
export type ApplicationState = "PENDING" | "APPROVED" | "REJECTED";

// 가입 신청 1건
export interface Application {
 user: AppUser;
 studyGroup: AppStudyGroup;
 createdAt: string; // "2024-01-01T00:00:00"
 lastModifiedAt: string; // "2024-01-01T00:00:00"
 approvedAt?: string; // 수락된 경우만 존재
 state: ApplicationState;
}

// 페이지 메타 (응답 예시 기준)
export interface PageMeta {
 size: number;
 number: number;
 totalElements: number;
 totalPages: number;
}

// 페이지 응답 공통
export interface PagedResponse<T> {
 content: T[];
 page: PageMeta;
}

/** ---------------------------
 *  주최자(Host) 전용 엔드포인트
 *  --------------------------- */

// 신청 목록 조회 (주최자)
export const getGroupApplications = async (
 groupId: number,
 opts?: { page?: number; size?: number; sort?: string }
) => {
 const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
 const { data } = await axios.get<PagedResponse<Application>>(
  `/api/study-groups/${groupId}/applications`,
  { params: { page, size, sort }, headers: getAuthHeader() }
 );
 return data;
};

// 신청 승인 (주최자)
export const approveApplication = async (groupId: number, userId: number) => {
 const { data } = await axios.post<Application>(
  `/api/study-groups/${groupId}/applications/${userId}/approve`,
  {},
  { headers: getAuthHeader() }
 );
 return data;
};

// 신청 거절 (주최자)
export const rejectApplication = async (groupId: number, userId: number) => {
 const { data } = await axios.post<Application>(
  `/api/study-groups/${groupId}/applications/${userId}/reject`,
  {},
  { headers: getAuthHeader() }
 );
 return data;
};

/** ---------------------------
 *  참가자(본인) 전용 엔드포인트
 *  --------------------------- */

// 가입 신청 (본인)
export const applyToStudyGroup = async (groupId: number) => {
 // POST /api/study-groups/{id}/join  (본문 없음)
 const { data } = await axios.post<Application>(
  `/api/study-groups/${groupId}/join`,
  {},
  { headers: getAuthHeader() }
 );
 return data;
};

// 가입 취소 (본인)
// 서버가 DELETE /join 을 지원하면 그걸 쓰고,
// 405/404면 POST /join/cancel 로 폴백
export const cancelMyApplication = async (groupId: number) => {
 try {
  const { data } = await axios.delete<Application>(
   `/api/study-groups/${groupId}/join`,
   { headers: getAuthHeader() }
  );
  return data;
 } catch (e: any) {
  const status = e?.response?.status;
  if (status === 405 || status === 404) {
   const { data } = await axios.post<Application>(
    `/api/study-groups/${groupId}/join/cancel`,
    {},
    { headers: getAuthHeader() }
   );
   return data;
  }
  throw e;
 }
};

// 탈퇴 (승인된 이후)
export const leaveStudyGroup = async (groupId: number) => {
 const res = await axios.delete(`/api/study-groups/${groupId}/leave`, {
  headers: getAuthHeader(),
 });
 return res.status; // 204 등
};

// 내 가입 신청 목록 (본인)
export const getMyApplications = async (opts?: {
 page?: number;
 size?: number;
 sort?: string;
}) => {
 const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {};
 const { data } = await axios.get<PagedResponse<Application>>(
  `/api/study-groups/my/applications`,
  { params: { page, size, sort }, headers: getAuthHeader() }
 );
 return data;
};

// 특정 그룹에 대한 내 신청 1건 (본인)
export const getMyApplicationForGroup = async (groupId: number) => {
 const paged = await getMyApplications({ size: 100 });
 return paged.content.find((a) => a.studyGroup.id === groupId) ?? null;
};
