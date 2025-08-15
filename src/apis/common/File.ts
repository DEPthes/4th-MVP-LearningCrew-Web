import axios from "axios";
import { getAuthHeader } from "../auth/auth";

const PLACEHOLDER = "/images/placeholder-group.png";

// 정상이면 blob 실패/없음 PLACEHOLDER
export const getImage = async (fileUuid?: string, _fileName?: string) => {
 if (!fileUuid) return PLACEHOLDER;

 try {
  const res = await axios.get(`/api/files/images/${fileUuid}`, {
   responseType: "blob",
   headers: getAuthHeader(),
  });

  // 한 번 더 체크
  const blob: Blob = res.data;
  if (
   !blob ||
   typeof blob.type !== "string" ||
   !blob.type.startsWith("image/")
  ) {
   return PLACEHOLDER;
  }
  return URL.createObjectURL(blob);
 } catch (err: any) {
  // 토큰 문제면 무토큰으로 한 번 더 시도
  const status = err?.response?.status;
  if (status === 401 || status === 403) {
   try {
    const res2 = await axios.get(`/api/files/images/${fileUuid}`, {
     responseType: "blob",
    });
    const blob2: Blob = res2.data;
    if (!blob2 || !blob2.type?.startsWith("image/")) return PLACEHOLDER;
    return URL.createObjectURL(blob2);
   } catch (_) {
    return PLACEHOLDER;
   }
  }
  return PLACEHOLDER;
 }
};

// blob URL
export const getFile = async (fileUuid: string) => {
 try {
  const res = await axios.get(`/api/files/downloads/${fileUuid}`, {
   responseType: "blob",
   headers: getAuthHeader(),
  });
  return URL.createObjectURL(res.data);
 } catch (err: any) {
  // 권한 문제면 무토큰 재시도
  const status = err?.response?.status;
  if (status === 401 || status === 403) {
   const res2 = await axios.get(`/api/files/downloads/${fileUuid}`, {
    responseType: "blob",
   });
   return URL.createObjectURL(res2.data);
  }
  throw err;
 }
};
