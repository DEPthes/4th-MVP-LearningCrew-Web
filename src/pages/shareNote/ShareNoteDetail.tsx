import { useParams } from "react-router-dom";
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy";
import styles from "../../styles/shareNote/ShareNoteDetailStyle.module.css";

export const ShareNoteDetail = () => {
  const { id } = useParams<{ id: string }>();

  // id로 해당 노트 찾기
  const note = ShareNoteListDummy.find(note => note.id === Number(id));

  if (!note) {
    return <div className={styles.detail__container}>노트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.detail__container}>
      <div className={styles.detail__header}>
        <h1 className={styles.detail__title}>{note.title}</h1>
        <div className={styles.detail__info}>
          <span className={styles.detail__writer}>작성자: {note.writer}</span>
          <span className={styles.detail__date}>작성일: {note.createdAt}</span>
        </div>
      </div>
      <div
        className={styles.detail__content}
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
};