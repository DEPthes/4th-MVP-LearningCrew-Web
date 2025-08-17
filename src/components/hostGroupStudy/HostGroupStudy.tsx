import { useNavigate } from "react-router-dom";
import styles from "../../styles/hostGroupStudy/HostGroupStudy.module.css";

export default function HostGroupStudy() {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/host-group-study/writing"); 
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.div__container}>
          <div className={styles.noteBox}>
            <h2 className={styles.noteTitle}>제목</h2>
            <p className={styles.noteContent}>내용</p>
          </div>
        </div>
        <div className={styles.button__container}>
          <button
            className={styles.button}
            onClick={handleWriteClick} 
          >
            작성
          </button>
        </div>
      </div>
    </>
  );
}