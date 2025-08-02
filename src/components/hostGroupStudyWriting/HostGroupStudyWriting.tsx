import styles from "../../styles/hostGroupStudyWriting/HostGroupStudyWriting.module.css"
import { ContentEditor } from "../common/ContentEditor"

export default function HostGroupStudyWriting() {
  const handleSubmit = (title: string, content: string) => {
    console.log("제출된 제목:", title)
    console.log("제출된 내용:", content)
  }

  return (
    <div className={styles.wrapper}>
      <ContentEditor
        wholeTitle="내 노트 작성하기"
        contentText="내 노트 내용"
        onSubmit={handleSubmit}
      />
    </div>
  )
}