import styles from "../../styles/common/Lock.module.css";
import LockImg from "../../assets/Lock.svg";

export const Lock = () => {
  return (
    <div className={styles.lock__container}>
      <p className={styles.lock__text}>참여자만 확인 가능합니다</p>
      <div className={styles.lock__img__container}>
        <img src={LockImg} />
        <p>잠금</p>
      </div>
    </div>
  )
}