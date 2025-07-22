import logo from "../../assets/learn-it-logo.svg"
import styles from "../../styles/header/Header.module.css"

export default function Header() {
    return (
        <>
            <div className={styles.div__container}>
                <div className={styles.logo__container}>
                <img src={logo} alt="learnIT-logo" className={styles.learn__it__logo}/>
                </div>
            </div>
        </>
    )
}