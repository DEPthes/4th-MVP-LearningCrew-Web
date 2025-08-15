import axios from "axios";

const Token = localStorage.getItem("accessToken");

//내 그룹 목록 조회
export const getJoinGroup = async () => {
 try {
  const response = await axios.get("/api/study-groups/my/membered", {
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  console.log(response.data);
  return response.data;
 } catch (error) {
  throw error;
 }
};

//전체 그룹 목록 조회

//내 주최 그룹 목록 조회
export const getHostedGroup = async () => {
 try {
  const response = await axios.get("/api/study-groups/my/owned", {
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};

//내 가입 신청 목록 조회
export const getAppliedGroup = async () => {
 try {
  const response = await axios.get("/api/study-groups/my/applications", {
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  console.log(response.data);
  return response.data;
 } catch (error) {
  throw error;
 }
};
