import { useNavigate } from "react-router-dom";
import logo from "../../assets/learn-it-logo.svg"
import styles from "../../styles/header/Header.module.css"

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.div__container}>
        <div className={styles.logo__container}>
          <img src={logo} alt="learnIT-logo" className={styles.learn__it__logo} onClick={() => navigate("/")} />
        </div>
      </div>
    </>
  )
}