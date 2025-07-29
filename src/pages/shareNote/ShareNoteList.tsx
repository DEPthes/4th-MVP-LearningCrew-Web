import { useNavigate } from "react-router-dom"
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy"
import { Sort } from "../../components/common/Sort"
import styles from "../../styles/shareNote/ShareNoteListPageStyle.module.css"

export const ShareNoteList = () => {
  const navigate = useNavigate();
  const noteData = ShareNoteListDummy;

  const handleNoteClick = (noteId: number) => {
    navigate(`/shareNoteDetail/${noteId}`);
  };

  return (
    <div className={styles.note__container}>
      <div className={styles.note__sort}><Sort /></div>
      <div className={styles.notelist_container}>
        <div className={styles.notelist_header}>
          <p className={styles.notelist_header_title}>제목</p>
          <p className={styles.notelist_header_writer}>작성자</p>
          <p className={styles.notelist_header_date}>작성일</p>
        </div>
        <div className={styles.notelist_body}>
          {noteData.map((note, index) => (
            <div
              key={index}
              className={styles.notelist_row}
              onClick={() => handleNoteClick(note.id)}
            >
              <p className={styles.notelist_title}>{note.title}</p>
              <p className={styles.notelist_writer}>{note.writer}</p>
              <p className={styles.notelist_createdAt}>{note.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}