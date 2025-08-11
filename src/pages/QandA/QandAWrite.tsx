import { useNavigate, useParams } from "react-router-dom"
import { ContentEditor } from "../../components/common/ContentEditor"
import styles from "../../styles/QandA/QandAWrite.module.css"
import { postQandA } from "../../apis/qanda/QandA";
// import { useState } from "react";

export const QandAWrite = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  // const [stepId, setStepId] = useState<string>("1");

  const handleSubmit = async (title: string, content: string, attachedFiles: File[], attachedImages: File[]) => {
    try {
      const response = await postQandA({
        groupId: groupId || "2",
        stepId: "1",
        title,
        content,
        attachedFiles,
        attachedImages,
      })
      console.log(response);
      alert("질문이 등록되었습니다.");
      navigate(`/group/${groupId}/QandA`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.write__container}>
      <ContentEditor contentText="질문 내용" wholeTitle="Q&A 작성하기" onSubmit={handleSubmit} />
    </div>
  )
}