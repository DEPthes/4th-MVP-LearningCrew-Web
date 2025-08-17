// apis/studygroup/studygroup.ts
import axios from "axios";
import { getAuthHeader } from "../auth/auth";

/** ---------- 공통 타입 ---------- */
export interface FileMeta {
  uuid: string;
  fileName: string;
  size?: number;
  handlingType?: "IMAGE" | "DOWNLOADABLE" | string; // 서버가 문자열로 주면 안전하게 허용
}

export interface AppUser {
  id: number;
  email: string;
  nickname: string;
  role?: "USER" | string;
  gender?: "MALE" | "FEMAIL" | "OTHER" | string;   // ※ 스펙상 FEMAIL 그대로
  profileImage?: FileMeta | null;
  createdAt?: string;       // ISO Datetime
  lastModifiedAt?: string;  // ISO Datetime
}

export interface AppCategory {
  id: number;
  name: string;
}

/** ---------- 스터디 상세 ---------- */
export interface StepStudy {
  step: number;          // 1-based
  endDate?: string;      // "YYYY-MM-DD"
  title: string;
  content: string;
}

export interface StudyGroupDetail {
  id: number;
  name: string;
  summary?: string | null;
  maxMembers?: number;
  groupImage?: FileMeta | null;
  categories?: AppCategory[];
  memberCount?: number;
  dibs?: boolean;
  startDate?: string;       // "YYYY-MM-DD"
  endDate?: string;         // "YYYY-MM-DD"
  owner?: AppUser;
  createdAt?: string;       // "2024-01-01T00:00:00"
  lastModifiedAt?: string;  // "2024-01-01T00:00:00"
  steps?: StepStudy[];      // 스텝 리스트
  currentStep?: number;     // 1-based
}

/** ---------- 조회 API ---------- */
export const getStudyGroup = async (groupId: string | number) => {
  const { data } = await axios.get<StudyGroupDetail>(
    `/api/study-groups/${groupId}`,
    { headers: getAuthHeader() }
  );
  return data;
};

// 필요하면 별칭으로도 export (기존 코드 호환)
export const getStudyGroupDetail = getStudyGroup;