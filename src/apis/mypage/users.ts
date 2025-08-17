import axios from "axios";
import { getAuthHeader } from "../auth/auth";

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
 birthday?: string | null;
};

export async function fetchMe() {
 const { data } = await axios.get<MeResponse>("/api/users/me", {
  headers: getAuthHeader(),
 });
 return data;
}

export type UpdateMePayload = {
 email?: string;
 nickname?: string;
 password?: string;
 profileImage?: File | null;
 /** YYYY-MM-DD */
 birthday?: string;
};

export type UpdateMeResponse = {
 email: string;
 nickname: string;
 role: "USER" | "ADMIN";
 createdAt: string;
 lastModifiedAt: string;
};

export async function updateMe(payload: UpdateMePayload) {
 const fd = new FormData();
 if (payload.email) fd.append("email", payload.email);
 if (payload.nickname) fd.append("nickname", payload.nickname);
 if (payload.password && payload.password.trim())
  fd.append("password", payload.password);
 if (payload.profileImage instanceof File)
  fd.append("profileImage", payload.profileImage);
 if (payload.birthday) fd.append("birthday", payload.birthday);

 const { data } = await axios.patch<UpdateMeResponse>("/api/users/me", fd, {
  headers: getAuthHeader(),
 });
 return data;
}
