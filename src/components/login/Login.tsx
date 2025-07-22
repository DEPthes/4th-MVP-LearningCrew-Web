import logo from "../../assets/learn-it-logo.svg"
import Header from "../header/Header"
import styles from "../../styles/login/Login.module.css"

export default function Login() {
    return (
        <>
        < Header />
        <div className={styles.div__container}>
            <div className={styles.form__title}>로그인</div>
            <form>
                <div className={styles.input__container}>
                <label className={styles.label}>아이디</label>
                <input type="email" placeholder="예) LearnIT@gmail.com" className={styles.input}></input>
                </div>
                <div className={styles.input__require}>*아이디를 입력하세요.</div>

                <div className={styles.input__container}>
                <label className={styles.label}>비밀번호</label>
                <input type="password" placeholder="비밀번호" className={styles.input}></input>
                <div className={styles.input__require}>*비밀번호를 입력하세요.</div>
                </div>
                <div className={styles.button__wrapper}>
                    <div className={styles.warning__msg}>*아이디 또는 비밀번호가 일치하지 않습니다.</div>
                    <button type="submit" className={styles.login__button}>로그인</button>
                </div>
            </form>
            <div className={styles.signUp__div__container}>
                <div className={styles.signUp__info}>아직 회원이 아니신가요?</div>
                <a href="#" className={styles.signUp__button}>회원가입</a>
            </div>
        </div>
        </>
    )
}