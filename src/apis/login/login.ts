import axios from "axios";

export async function nicknameConfirm(nickname: string) {
 try {
  const response = await axios.get("/api/auth/nickname-exist", {
   params: { nickname },
  });
  return response.data;
 } catch (error) {
  console.error(error);
  throw error;
 }
}
