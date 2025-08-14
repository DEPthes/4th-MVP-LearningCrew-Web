import axios from "axios";

const Token = localStorage.getItem("accessToken");

export const getStudyGroup = async (groupId: string) => {
 try {
  const response = await axios.get(`/api/study-groups/${groupId}`, {
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};
