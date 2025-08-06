import styles from "../../styles/QandA/WriteBtnComponentStyle.module.css"
import Add from "../../assets/Add.svg";
import { useNavigate } from "react-router-dom";

export const WriteBtn = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/GroupLayout/QandA/write");
  }

  return (
    <button className={styles.writeBtn__button} onClick={handleWriteClick}>
      <img src={Add} /><p>작성</p>
    </button>
  )
}