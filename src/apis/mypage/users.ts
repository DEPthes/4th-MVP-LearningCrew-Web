import { api } from "../common/client"; 

export type ProfileImage = {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: "IMAGE" | "DOWNLOADABLE";
};

export type MeResponse = {
  id: number;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  gender: "MALE" | "FEMALE" | "FEMAIL" | "OTHER"; 
  profileImage?: ProfileImage | null;
  createdAt: string;
  lastModifiedAt: string;
};

export async function fetchMe() {
  const { data } = await api.get<MeResponse>("/api/users/me");
  return data;
}
