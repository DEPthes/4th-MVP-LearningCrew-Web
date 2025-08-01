import { ContentEditor } from "../../components/common/ContentEditor"
import styles from "../../styles/QandA/QandAWrite.module.css"

export const QandAWrite = () => {
  return (
    <div className={styles.write__container}>
      <ContentEditor contentText="질문 내용" wholeTitle="Q&A 작성하기" />
    </div>
  )
}