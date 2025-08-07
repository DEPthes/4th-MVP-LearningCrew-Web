import { useState } from "react"
import Header from "../../components/header/Header"
import styles from "../../styles/signUp/SignUp.module.css"
import IdInputGroup from "../../components/signUp/IdInputGroup"
import PasswordInputGroup from "../../components/signUp/PasswordInputGroup"
import BirthCalendar from "../../components/signUp/BirthCalendar"
import Profile from "../../components/signUp/Profile"
import Gender from "../../components/signUp/Gender"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const [emailMessage, setEmailMessage] = useState("*이메일을 입력하세요.")
  const [nicknameMessage, setNicknameMessage] = useState("*닉네임을 입력하세요.")
  const [passwordMessage, setPasswordMessage] = useState("*영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상")
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("*비밀번호를 다시 입력하세요.")

  const [emailValid, setEmailValid] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  const navigate = useNavigate()

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (value === "") {
      setPasswordMessage("*영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상")
      setPasswordValid(false)
    } else if (regex.test(value)) {
      setPasswordMessage("*사용 가능한 비밀번호입니다.")
      setPasswordValid(true)
    } else {
      setPasswordMessage("*비밀번호 조건에 충족하지 않습니다.")
      setPasswordValid(false)
    }
  }

  const validateConfirmPassword = (value: string) => {
    if (value === "") {
      setConfirmPasswordMessage("*비밀번호를 다시 입력하세요.")
      setPasswordsMatch(false)
    } else if (value === password) {
      setConfirmPasswordMessage("*비밀번호가 일치합니다.")
      setPasswordsMatch(true)
    } else {
      setConfirmPasswordMessage("*비밀번호가 일치하지 않습니다.")
      setPasswordsMatch(false)
    }
  }

  const handleCheckEmail = async () => {
    try {
      const res = await axios.get(`/api/auth/email-exist?email=${email}`)
      if (res.data.exist) {
        setEmailMessage("*중복되는 아이디입니다.")
        setEmailValid(false)
      } else {
        setEmailMessage("*사용 가능한 아이디입니다.")
        setEmailValid(true)
      }
    } catch (error) {
      setEmailMessage("*중복 확인 중 오류가 발생했습니다.")
      setEmailValid(false)
    }
  }

  const handleCheckNickname = async () => {
    try {
      const res = await axios.get(`/api/auth/nickname-exist?nickname=${nickname}`)
      if (res.data.exist) {
        setNicknameMessage("*중복되는 닉네임입니다.")
        setNicknameValid(false)
      } else {
        setNicknameMessage("*사용 가능한 닉네임입니다.")
        setNicknameValid(true)
      }
    } catch (error) {
      setNicknameMessage("*중복 확인 중 오류가 발생했습니다.")
      setNicknameValid(false)
    }
  }

  const handleSignUp = async () => {
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("nickname", nickname)
      formData.append("birthday", birthday ? birthday.toISOString().split("T")[0] : "")
      if (gender) formData.append("gender", gender)
      if (profileImage) formData.append("profile", profileImage)

      await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/welcome")
    } catch (error: any) {
      console.error("회원가입 실패:", error)
      alert("회원가입에 실패했습니다.")
    }
  }

  return (
    <>
      <Header />
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.signUp__title}>회원가입</div>

          <IdInputGroup
            label="아이디"
            placeholder="아이디를 입력하세요"
            message={emailMessage}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailMessage("*이메일을 입력하세요.")
              setEmailValid(false)
            }}
            onCheckDuplicate={handleCheckEmail}
            showCheckButton
            isValid={emailValid}
          />

          <PasswordInputGroup
            label="비밀번호"
            placeholder="비밀번호를 입력하세요."
            message={passwordMessage}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
              validateConfirmPassword(confirmPassword)
            }}
          />

          <PasswordInputGroup
            label="비밀번호 재확인"
            placeholder="비밀번호를 다시 입력하세요."
            message={confirmPasswordMessage}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              validateConfirmPassword(e.target.value)
            }}
          />

          <IdInputGroup
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            message={nicknameMessage}
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              setNicknameMessage("*닉네임을 입력하세요.")
              setNicknameValid(false)
            }}
            onCheckDuplicate={handleCheckNickname}
            showCheckButton
            isValid={nicknameValid}
          />

          <BirthCalendar value={birthday} onChange={setBirthday} />
          <Gender selected={gender} onSelect={setGender} />
          <Profile onImageChange={setProfileImage} />

          <button
            type="button"
            className={styles.button}
            onClick={handleSignUp}
            disabled={!passwordValid || !passwordsMatch}
          >
            가입
          </button>
        </div>
      </div>
    </>
  )
}