import { useParams } from "react-router-dom";
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy";
import { PostDetail } from "../../components/common/PostDetail";
import styles from "../../styles/QandA/QandADetailPageStyle.module.css";
import { Comment } from "../../components/QandA/Comment"

export const QandADetail = () => {
  const { id } = useParams<{ id: string }>();

  // id로 해당 노트 찾기
  const note = ShareNoteListDummy.find(note => note.id === Number(id));
  const comments = ShareNoteListDummy.find(note => note.id === Number(id))?.comments;

  return (
    <div className={styles.qanda__container}>
      <PostDetail data={note} />
      <Comment comments={comments} />
    </div>
  );
}