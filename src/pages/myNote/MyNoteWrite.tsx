import { useNavigate, useParams } from "react-router-dom";
import { postNote } from "../../apis/studygroup/Note";
import { ContentEditor } from "../../components/common/ContentEditor";
import styles from "../../styles/myNote/MyNoteWritePageStyle.module.css";

export const MyNoteWrite = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();

  const handleSubmit = async (title: string, content: string, attachedFiles: File[], attachedImages: File[]) => {
    try {
      const response = await postNote({
        groupId: groupId || "2",
        stepId: stepId || "1",
        title,
        content,
        attachedFiles,
        attachedImages,
      })
      console.log(response);
      alert("노트가 등록되었습니다.");
      navigate(`/group/${groupId}/step/${stepId}/myNote`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={styles.mynote__write__container}>
      <ContentEditor contentText="내 노트 내용" wholeTitle="내 노트 작성하기" onSubmit={handleSubmit} />
    </div>
  )
}