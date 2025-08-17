// src/apis/Group/StudyGroup.ts
import axios from "axios";

export type Category = { id: number; name: string };

export type ImageMeta = {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: "IMAGE" | "DOWNLOADABLE";
};

export type UserLite = {
  id: number;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  gender?: "MALE" | "FEMAIL" | "OTHER";
  profileImage?: ImageMeta;
  createdAt?: string;
  lastModifiedAt?: string;
};

export type StepItem = {
  step: number;
  endDate?: string;
  title?: string;
  content?: string; // 서버가 HTML/텍스트 중 무엇을 주든 string
};

export type StudyGroupDetail = {
  id: number;
  name: string;
  summary: string;
  maxMembers: number;
  groupImage?: ImageMeta;
  categories: Category[];
  memberCount: number;
  dibs: boolean;
  startDate: string;       // "YYYY-MM-DD"
  endDate: string;         // "YYYY-MM-DD"
  owner: UserLite;
  createdAt: string;       // ISO
  lastModifiedAt: string;  // ISO
  steps: StepItem[];
  currentStep: number;     // 1-based
};

export async function getStudyGroupDetail(id: number) {
  const { data } = await axios.get<StudyGroupDetail>(`/api/study-groups/${id}`);
  return data;
}