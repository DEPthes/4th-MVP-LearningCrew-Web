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
  const [passwordMessage, setPasswordMessage] = useState("*영어 대소문자, 숫자, 특수기호 포함 최소 8자 이상")
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("*비밀번호를 다시 입력하세요.")

  const [emailValid, setEmailValid] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  const [formError, setFormError] = useState("")

  const navigate = useNavigate()

  // 영어 대문자 + 소문자 + 숫자 + 특수문자 각각 1자 이상, 총 8자 이상
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

  const validatePassword = (value: string) => {
    if (value === "") {
      setPasswordMessage("*영어 대소문자, 숫자, 특수기호 포함 최소 8자 이상")
      setPasswordValid(false)
    } else if (passwordRegex.test(value)) {
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
      // 프로젝트에 따라 엔드포인트 다를 수 있어 현재 코드 유지
      const res = await axios.get(`/api/auth/email-exist?email=${email}`)
      if (res.data.exist) {
        setEmailMessage("*중복되는 아이디입니다.")
        setEmailValid(false)
      } else {
        setEmailMessage("*사용 가능한 아이디입니다.")
        setEmailValid(true)
      }
    } catch {
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
    } catch {
      setNicknameMessage("*중복 확인 중 오류가 발생했습니다.")
      setNicknameValid(false)
    }
  }

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !nickname || !birthday || !gender) {
      setFormError("*입력되지 않은 정보가 있습니다.")
      return
    }
    if (!passwordValid) {
      setFormError("*비밀번호 조건에 충족하지 않습니다.")
      return
    }
    if (!passwordsMatch) {
      setFormError("*비밀번호가 일치하지 않습니다.")
      return
    }

    setFormError("")

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("nickname", nickname)
      formData.append("birthday", birthday ? birthday.toISOString().split("T")[0] : "")
      if (gender) formData.append("gender", gender)
      if (profileImage) formData.append("profile", profileImage)

      await axios.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      navigate("/welcome")
    } catch (error) {
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
              setFormError("")
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
              const v = e.target.value
              setPassword(v)
              validatePassword(v)
              validateConfirmPassword(confirmPassword) // 재확인 문구도 즉시 갱신
              setFormError("")
            }}
          />

          <PasswordInputGroup
            label="비밀번호 재확인"
            placeholder="비밀번호를 다시 입력하세요."
            message={confirmPasswordMessage}
            value={confirmPassword}
            onChange={(e) => {
              const v = e.target.value
              setConfirmPassword(v)
              validateConfirmPassword(v)
              setFormError("")
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
              setFormError("")
            }}
            onCheckDuplicate={handleCheckNickname}
            showCheckButton
            isValid={nicknameValid}
          />

          <BirthCalendar
            value={birthday}
            onChange={(date) => {
              setBirthday(date)
              setFormError("")
            }}
          />

          <Gender
            selected={gender}
            onSelect={(g) => {
              setGender(g)
              setFormError("")
            }}
          />

          <Profile
            onImageChange={(file) => {
              setProfileImage(file)
            }}
          />

          {/* 버튼 & 에러 문구 묶음 */}
          <div className={styles.buttonWrapper}>
            {formError && (
              <div className={styles.formError} role="alert" aria-live="assertive">
                {formError}
              </div>
            )}
            <button
              type="button"
              className={styles.button}
              onClick={handleSignUp}
            >
              가입
            </button>
          </div>
        </div>
      </div>
    </>
  )
}