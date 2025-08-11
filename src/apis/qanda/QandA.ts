import axios from "axios";

interface WriteQandARequest {
 groupId: string;
 stepId: string;
 title: string;
 content: string;
 attachedFiles: File[];
 attachedImages: File[];
}

const Token = localStorage.getItem("accessToken");

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
    headers: {
     Authorization: `Bearer ${Token}`,
    },
   }
  );
  return response.data;
 } catch (error) {
  console.error(error);
  throw error;
 }
};
