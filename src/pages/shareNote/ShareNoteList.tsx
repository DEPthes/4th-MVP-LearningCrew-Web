import { useNavigate } from "react-router-dom"
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy"
import { Sort } from "../../components/common/Sort"
import styles from "../../styles/shareNote/ShareNoteListPageStyle.module.css"
import { List } from "../../components/common/List"

export const ShareNoteList = () => {
  const navigate = useNavigate();
  const noteData = ShareNoteListDummy;

  const handleNoteClick = (noteId: number) => {
    navigate(`/shareNoteDetail/${noteId}`);
  };

  return (
    <div className={styles.note__container}>
      <div className={styles.note__sort}><Sort /></div>
      <List handleClick={handleNoteClick} items={noteData} pagenation={true} />
    </div>
  )
}