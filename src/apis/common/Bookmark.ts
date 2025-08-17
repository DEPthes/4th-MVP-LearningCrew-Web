import axios from "axios";
import { getAuthHeader } from "../auth/auth";

export const postBookmark = async (groupId: string) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${groupId}/dibs`,
   {},
   { headers: getAuthHeader() }
  );
  //true면 현재 북마크 되어있는 상태, false면 북마크 되어있지 않은 상태
  return response.data.dibs;
 } catch (error) {
  throw error;
 }
};
