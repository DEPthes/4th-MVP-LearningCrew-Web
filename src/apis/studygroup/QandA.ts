import axios from "axios";
import { getAuthHeader } from "../auth/auth";

interface WriteQandARequest {
 groupId: string;
 stepId: string;
 title: string;
 content: string;
 attachedFiles: File[];
 attachedImages: File[];
}

interface SharedQandAListRequest {
 groupId: string;
 stepId: string;
}

interface PostCommentRequest {
 groupId: string;
 qnaId: string;
 content: string;
 attachedFiles: File[];
 attachedImages: File[];
}

//리스트 보기
export const getQandAList = async (data: SharedQandAListRequest) => {
 const formData = new FormData();
 formData.append("step", data.stepId);
 try {
  const response = await axios.get(`/api/study-groups/${data.groupId}/qna`, {
   headers: getAuthHeader(),
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};

//디테일 보기
export const getQandADetail = async ({
 groupId,
 qnaId,
}: {
 groupId: string;
 qnaId: string;
}) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${groupId}/qna/${qnaId}`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//답글
export const getComments = async ({
 groupId,
 qnaId,
}: {
 groupId: string;
 qnaId: string;
}) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${groupId}/qna/${qnaId}/comments`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//질문 생성
export const postQandA = async (data: WriteQandARequest) => {
 const formdata = new FormData();
 formdata.append("title", data.title);
 formdata.append("content", data.content);
 if (data.attachedFiles) {
  data.attachedFiles.forEach((file) => {
   formdata.append("attachedFiles", file);
  });
 }
 if (data.attachedImages) {
  data.attachedImages.forEach((image) => {
   formdata.append("attachedImages", image);
  });
 }

 try {
  console.log(data);
  const response = await axios.post(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/questions`,
   formdata,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  console.error(error);
  throw error;
 }
};

//댓글 생성
export const postComment = async (data: PostCommentRequest) => {
 const formData = new FormData();
 formData.append("content", data.content);
 if (data.attachedImages) {
  data.attachedImages.forEach((image) => {
   formData.append("attachedImages", image);
  });
 }
 if (data.attachedFiles) {
  data.attachedFiles.forEach((file) => {
   formData.append("attachedFiles", file);
  });
 }
 try {
  const response = await axios.post(
   `/api/study-groups/${data.groupId}/qna/${data.qnaId}/comments`,
   formData,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//임시
export const getMyInfo = async () => {
 try {
  const response = await axios.get(`/api/users/me`, {
   headers: getAuthHeader(),
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};
