import { ContentEditor } from "../../components/common/ContentEditor";
import styles from "../../styles/myNote/MyNoteWritePageStyle.module.css";

export const MyNoteWrite = () => {
  return (
    <div className={styles.mynote__write__container}>
      <ContentEditor contentText="내 노트 내용" wholeTitle="내 노트 작성하기" />
    </div>
  )
}