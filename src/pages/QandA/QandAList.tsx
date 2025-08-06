import { useNavigate } from "react-router-dom";
import { WriteBtn } from "../../components/QandA/WriteBtn"
import styles from "../../styles/QandA/QandAListPageStyle.module.css"
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy";
import { List } from "../../components/common/List";
import { Sort } from "../../components/common/Sort";
import { useState } from "react";

export const QandAList = () => {
  const navigate = useNavigate();
  const noteData = ShareNoteListDummy;
  const [qnaSort, setQnaSort] = useState<string>("최신순");

  const handleNoteClick = (noteId: number) => {
    navigate(`/GroupLayout/QandADetail/${noteId}`);
  };

  return (
    <div className={styles.qanda__container}>
      <div className={styles.qanda__sort}><Sort sort={qnaSort} setSort={setQnaSort} /></div>
      <List handleClick={handleNoteClick} items={noteData} pagenation={true} sort={qnaSort} />
      <WriteBtn />
    </div>
  )
}