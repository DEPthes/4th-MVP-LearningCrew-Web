import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export const getStudyGroup = async (groupId: string) => {
 try {
  const response = await axios.get(`/api/study-groups/${groupId}`, {
   headers: getAuthHeader(),
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};
