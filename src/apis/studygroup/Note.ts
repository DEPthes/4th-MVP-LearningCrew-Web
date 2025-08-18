import axios from "axios";
import { getAuthHeader } from "../auth/auth";

interface NoteRequest {
 groupId: string;
 stepId: string;
 title: string;
 content: string;
 attachedFiles: File[];
 attachedImages: File[];
}

interface SharedNoteListRequest {
 groupId: string;
 stepId: string;
}

//노트 생성
export const postNote = async (data: NoteRequest) => {
 try {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  data.attachedFiles.forEach((file) => formData.append("attachedFiles", file));
  data.attachedImages.forEach((image) =>
   formData.append("attachedImages", image)
  );

  const response = await axios.post(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/notes`,
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

//노트 상세 조회
export const getDetailNote = async (noteId: string) => {
 try {
  const response = await axios.get(`/api/notes/${noteId}`, {
   headers: getAuthHeader(),
  });
  return response.data;
 } catch (error) {
  throw error;
 }
};

//공유 노트 목록 조회
export const getSharedNoteList = async (data: SharedNoteListRequest) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/notes`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//내 노트 상세 조회
export const getMyNote = async (data: SharedNoteListRequest) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/notes/my`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};
