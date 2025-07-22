import Header from "../../components/header/Header"
import styles from "../../styles/welcomePage/welcomePage.module.css"

export default function WelcomePage() {
  return (
    <div className={styles.page__wrapper}>
      <Header />
      <div className={styles.content__center}>
        <p className={styles.join__completed}>가입이 완료되었습니다!</p>
        <a href="#" className={styles.search__study}>스터디 찾으러 가기 ＞</a>
      </div>
    </div>
  )
}