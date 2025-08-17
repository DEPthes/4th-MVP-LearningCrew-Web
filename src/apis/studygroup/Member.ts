import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export const getMember = async (groupId: number) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${groupId}/applications`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

export const ApproveMember = async (groupId: number, userId: number) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${groupId}/applications/${userId}/approve`,
   {},
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

export const RejectMember = async (groupId: number, userId: number) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${groupId}/applications/${userId}/reject`,
   {},
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};
