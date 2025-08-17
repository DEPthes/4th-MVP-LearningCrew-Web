import axios from "axios";
import { getAuthHeader } from "../auth/auth";

interface PageInfo {
 sort?: "created_at" | "relative" | "alphabet";
 order?: "desc" | "asc";
 searchKeyword?: string;
 page?: number;
 size?: number;
}

//내 그룹 목록 조회
export const getJoinGroup = async (data: PageInfo = {}) => {
 try {
  const page = data.page ?? 0;
  const size = data.size ?? 10;

  let response;
  if (!data.sort && !data.order) {
   response = await axios.get(
    `/api/study-groups/my/membered?sort=created_at&order=desc&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else if (!data.searchKeyword) {
   response = await axios.get(
    `/api/study-groups/my/membered?sort=${data.sort}&order=${data.order}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else {
   response = await axios.get(
    `/api/study-groups/my/membered?sort=${data.sort}&order=${data.order}&searchKeyword=${data.searchKeyword}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  }
  return response.data;
 } catch (error) {
  throw error;
 }
};

//전체 그룹 목록 조회

//내 주최 그룹 목록 조회
export const getHostedGroup = async (data: PageInfo = {}) => {
 try {
  const page = data.page ?? 0;
  const size = data.size ?? 10;

  let response;
  if (!data.sort && !data.order) {
   response = await axios.get(
    `/api/study-groups/my/owned?sort=created_at&order=desc&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else if (!data.searchKeyword) {
   response = await axios.get(
    `/api/study-groups/my/owned?sort=${data.sort}&order=${data.order}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else {
   response = await axios.get(
    `/api/study-groups/my/owned?sort=${data.sort}&order=${data.order}&searchKeyword=${data.searchKeyword}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  }
  return response.data;
 } catch (error) {
  throw error;
 }
};

//내 가입 신청 목록 조회
export const getAppliedGroup = async (data: PageInfo = {}) => {
 try {
  const page = data.page ?? 0;
  const size = data.size ?? 10;

  let response;
  if (!data.sort && !data.order) {
   response = await axios.get(
    `/api/study-groups/my/applications?sort=created_at&order=desc&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else if (!data.searchKeyword) {
   response = await axios.get(
    `/api/study-groups/my/applications?sort=${data.sort}&order=${data.order}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  } else {
   response = await axios.get(
    `/api/study-groups/my/applications?sort=${data.sort}&order=${data.order}&searchKeyword=${data.searchKeyword}&page=${page}&size=${size}`,
    {
     headers: getAuthHeader(),
    }
   );
  }
  return response.data;
 } catch (error) {
  throw error;
 }
};
