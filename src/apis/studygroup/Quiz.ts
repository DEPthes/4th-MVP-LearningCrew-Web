import axios from "axios";
import { getAuthHeader } from "../auth/auth";

interface QuizRequest {
 groupId: string;
 stepId: string;
}

interface AnswerProps {
 quizId: number;
 selectedOptions: number[]; // 배열로 수정
}

interface QuizSubmitRequest {
 groupId: string;
 stepId: string;
 answers: AnswerProps[];
}

//퀴즈 내용 불러오기
export const getQuiz = async (data: QuizRequest) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/quiz`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//퀴즈 제출하기
export const postQuiz = async (data: QuizSubmitRequest) => {
 try {
  const response = await axios.post(
   `/api/study-groups/${data.groupId}/steps/${data.stepId}/submit`,
   {
    answers: data.answers,
   },
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};

//퀴즈 생성
export const postQuizCreate = async (data: QuizRequest) => {
 try {
  await axios.post(`/api/quiz/admin/run/target`, {
   groupId: data.groupId,
   stepId: data.stepId,
   headers: getAuthHeader(),
  });
 } catch (error) {
  throw error;
 }
};

//퀴즈 결과 불러오기
export const getQuizResult = async (groupId: string) => {
 try {
  const response = await axios.get(
   `/api/study-groups/${groupId}/steps/records`,
   {
    headers: getAuthHeader(),
   }
  );
  return response.data;
 } catch (error) {
  throw error;
 }
};
