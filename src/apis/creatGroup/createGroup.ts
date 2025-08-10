import axios from "axios";

interface StepItem {
 step: number;
 startDate: string;
 endDate: string;
}

interface CreateGroupRequest {
 name: string;
 summary: string;
 maxMembers: number;
 categories: string[];
 startDate: string;
 endDate: string;
 steps: StepItem[];
 groupImage: File;
}

const Token =
 "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwicmVmcmVzaFV1aWQiOiJleUpoYkdjaU9pSklVelV4TWlKOS5leUp6ZFdJaU9pSXhJaXdpZEc5clpXNVVlWEJsSWpvaVVrVkdVa1ZUU0NJc0ltbGhkQ0k2TVRjMU5EYzRPRGN4TWl3aVpYaHdJam94TnpVMU9UazRNekV5ZlEuVXZnQ3JReFJpTXEyZEJmanlXcjlSb0xNMEdSeXNMcXFGMjVRbExlR2Y4OWtiWWFEV3o1WGZ0aG83dUp5RXM5cU1LdmRkeDV4czJRMlcwekRtTmVoWFEiLCJpYXQiOjE3NTQ3ODg3MTIsImV4cCI6MTc1NDc5MDUxMn0.34cst0vab1oP6--2dwqvn0wGXaMVwxQEWuLd00e3lo7O_ZD5sJXbCys7KAZkluR6HpihZjam_V11n_uTQwpEng";

export async function PostCreateGroup(data: CreateGroupRequest) {
 try {
  console.log(data);
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("summary", data.summary);
  formData.append("maxMembers", data.maxMembers.toString());
  // // 카테고리는 개별 키로 전송 (categories=val1, categories=val2, ...)
  data.categories.forEach((category) => {
   console.log(typeof data.categories, data.categories);
   formData.append("categories", category);
  });

  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  // // steps는 각 항목의 endDate만 개별 키로 전송
  data.steps.forEach((step) => {
   console.log(step.endDate, typeof step.endDate);
   formData.append("steps", String(step.endDate));
  });

  formData.append("groupImage", data.groupImage);

  // 디버그: 전송되는 formData 확인
  for (const [key, value] of formData.entries()) {
   console.log(key, value);
  }
  console.log("categories(getAll):", formData.getAll("categories"));

  const response = await axios.post("/api/study-groups", formData, {
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  return response.data;
 } catch (error) {
  alert("그룹 생성에 실패했습니다.");
  console.log("createGroupError" + error);
  throw error;
 }
}
