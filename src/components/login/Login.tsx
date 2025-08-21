import { useState } from "react"
import Header from "../header/Header"
import styles from "../../styles/login/Login.module.css"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../apis/auth/auth"
import { useNavbar } from "../../hooks/NavbarContext"

export default function Login() {
  const { setActiveTab } = useNavbar();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      setActiveTab("마이페이지")
      navigate("/mypage")
    } catch (err) {
      console.error("로그인 실패:", err)
      setError(true)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.div__container}>
        <div className={styles.form__title}>로그인</div>
        <form onSubmit={handleLogin}>
          <div className={styles.input__container}>
            <label className={styles.label}>아이디</label>
            <input
              type="email"
              placeholder="예) LearnIT@gmail.com"
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(false)
              }}
            />
            <div className={`${styles.input__require} ${email ? styles.hidden : ""}`}>
              *아이디를 입력하세요.
            </div>
          </div>

          <div className={styles.input__container}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
            />
            <div className={`${styles.input__require} ${password ? styles.hidden : ""}`}>
              *비밀번호를 입력하세요.
            </div>
          </div>

          <div className={styles.button__wrapper}>
            {error && (
              <div className={styles.warning__msg}>
                *아이디 또는 비밀번호가 일치하지 않습니다.
              </div>
            )}
            <button type="submit" className={styles.login__button}>
              로그인
            </button>
          </div>
        </form>

        <div className={styles.signUp__div__container}>
          <div className={styles.signUp__info}>아직 회원이 아니신가요?</div>
          <Link to="/signUp" className={styles.signUp__button}>
            회원가입
          </Link>
        </div>
      </div>
    </>
  )
}