import axios from "axios";
import { getAuthHeader } from "../auth/auth";

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
   headers: getAuthHeader(),
  });
  return response.data;
 } catch (error) {
  alert("그룹 생성에 실패했습니다.");
  console.log("createGroupError" + error);
  throw error;
 }
}
