import Header from "../../components/header/Header"
import styles from "../../styles/signUp/SignUp.module.css"
import IdInputGroup from "../../components/signUp/IdInputGroup"
import PasswordInputGroup from "../../components/signUp/PasswordInputGroup"
import Date from "../../components/signUp/Date"
import Profile from "../../components/signUp/Profile"
import Gender from "../../components/signUp/Gender"


export default function SignUp() {
    return(
        <>
        <Header />
        <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
            <div className={styles.signUp__title}>회원가입</div>
            <IdInputGroup label="아이디" placeholder="아이디를 입력하세요" message="*이메일을 입력하세요." type = "email"/>
            <PasswordInputGroup label="비밀번호" placeholder="비밀번호를 입력하세요." message="*영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상" message2="*비밀번호를 입력하세요."/>
            <PasswordInputGroup label="비밀번호 재확인" placeholder="비밀번호를 다시 입력하세요." message="*비밀번호가 일치하지 않습니다."/>
            <IdInputGroup label="닉네임" placeholder="닉네임을 입력하세요" message="*닉네임을 입력하세요." type = "text"/>
            <Date />
            <Profile />
            <Gender />
            <button type="submit" className={styles.button}>가입</button>
        </div>
        </div>
        </>
    )
}