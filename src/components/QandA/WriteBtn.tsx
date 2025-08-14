import styles from "../../styles/QandA/WriteBtnComponentStyle.module.css"
import Add from "../../assets/Add.svg";
import { useNavigate, useParams } from "react-router-dom";

export const WriteBtn = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();

  const handleWriteClick = () => {
    navigate(`/group/${groupId}/step/${stepId}/QandA/write`);
  }

  return (
    <button className={styles.writeBtn__button} onClick={handleWriteClick}>
      <img src={Add} /><p>작성</p>
    </button>
  )
}