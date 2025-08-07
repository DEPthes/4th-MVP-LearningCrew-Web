import axios from "axios";

// interface createGroupProps {
//  name: string;
//  summary: string;
//  maxMembers: string;
//  groupImage: string;
//  categories: string[];
//  startDate: string;
//  endDate: string;
//  steps: string[];
// }

const Token =
 "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwicmVmcmVzaFV1aWQiOiJleUpoYkdjaU9pSklVelV4TWlKOS5leUp6ZFdJaU9pSXlJaXdpZEc5clpXNVVlWEJsSWpvaVVrVkdVa1ZUU0NJc0ltbGhkQ0k2TVRjMU5EUTJOek0yT1N3aVpYaHdJam94TnpVMU5qYzJPVFk1ZlEuREQ0VkdocE9Bcl9GSVk5aDRyTVBrbm5QQi1RdzRsYnlpdFN3d2lLQVA4MlBXVGwtcl9hNnNPNFQ3enN5WnZqY0lpU3NfWE1HNFY5QlNFYzVwaEZiMUEiLCJpYXQiOjE3NTQ0NjczNjksImV4cCI6MTc1NDQ2OTE2OX0.zQlutnXeSQRxX8kuDMdLLAaQzEYcStluMO_PcGlyl9bVe_HlfMb0KsgjmXIMwKr20WzmQN7eMgH5hwDIzwmUvg";

export async function PostCreateGroup() {
 try {
  const response = await axios.post(
   "/api/study-groups",
   {
    name: "그룹테스트",
    summary: "group summary",
    maxMembers: 10,
    groupImage: "",
    categories: ["string"],
    startDate: "2025-08-06",
    endDate: "2025-08-19",
    steps: ["2025-08-12", "2025-08-19"],
   },
   {
    headers: {
     Authorization: `Bearer ${Token}`,
    },
   }
  );
  return response.data;
 } catch (error) {
  console.log("createGroupError" + error);
  throw error;
 }
}
