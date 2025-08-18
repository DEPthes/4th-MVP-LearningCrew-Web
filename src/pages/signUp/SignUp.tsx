// src/pages/signUp/SignUp.tsx
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
import { login as loginApi } from "../../apis/auth/auth"

// birthday를 +1일 처리하는 헬퍼 함수
function adjustBirthdayForTimezone(birthday: Date): string {
  // 24시간(밀리초)을 더해서 다음 날로 조정
  const adjustedDate = new Date(birthday.getTime() + 24 * 60 * 60 * 1000);
  return adjustedDate.toISOString().split("T")[0];
}

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const [emailMessage, setEmailMessage] = useState("*이메일을 입력하세요.")
  const [nicknameMessage, setNicknameMessage] = useState("*10글자 내")
  const [passwordMessage, setPasswordMessage] = useState(
    "*영어 소문자, 숫자, 특수기호 포함 최소 8자 이상"
  )
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState(
    "*비밀번호를 다시 입력하세요."
  )

  const [emailValid, setEmailValid] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  // ✅ 닉네임 에러(길이 초과/중복확인 오류 등) 표시용
  const [nicknameError, setNicknameError] = useState(false)

  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  // ✅ 영어 소문자 + 숫자 + 특수문자 각각 1자 이상, 총 8자 이상
  const passwordRegex =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

  const validatePassword = (value: string) => {
    if (value === "") {
      setPasswordMessage("*영어 소문자, 숫자, 특수기호 포함 최소 8자 이상")
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
      const res = await axios.get("/api/auth/email-exist", { params: { email } })
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
      const res = await axios.get("/api/auth/nickname-exist", { params: { nickname } })
      if (res.data.exist) {
        setNicknameMessage("*중복되는 닉네임입니다.")
        setNicknameValid(false)
        setNicknameError(true) // 중복이면 에러 표시
      } else {
        setNicknameMessage("*사용 가능한 닉네임입니다.")
        setNicknameValid(true)
        setNicknameError(false)
      }
    } catch {
      setNicknameMessage("*중복 확인 중 오류가 발생했습니다.")
      setNicknameValid(false)
      setNicknameError(true) // 오류도 에러 표시
    }
  }

  const handleSignUp = async () => {
    // ✅ 필수값
    if (!email || !password || !confirmPassword || !nickname || !birthday || !gender) {
      setFormError("*입력되지 않은 정보가 있습니다.")
      return
    }
    // ✅ 닉네임 길이 제한: 10자 초과면 가입 차단
    if (nickname.length > 10) {
      setFormError("*닉네임은 10글자 이하여야 합니다.")
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
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("nickname", nickname)
      formData.append("birthday", birthday ? adjustBirthdayForTimezone(birthday) : "")
      if (gender) formData.append("gender", gender)
      if (profileImage) formData.append("profileImage", profileImage)

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      await axios.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      await loginApi(email, password)
      navigate("/welcome")
    } catch (error) {
      console.error("회원가입 실패:", error)
      alert("회원가입에 실패했습니다.")
    } finally {
      setSubmitting(false)
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
              validateConfirmPassword(confirmPassword)
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
              const v = e.target.value
              setNickname(v)

              // ✅ 길이 검사: 10자 초과 시 에러 + 색상 표시
              if (v.length > 10) {
                setNicknameMessage("*닉네임 조건에 충족하지 않습니다.")
                setNicknameValid(false)
                setNicknameError(true)
              } else {
                setNicknameMessage("*10글자 내")
                setNicknameValid(false)
                setNicknameError(false)
              }

              setFormError("")
            }}
            onCheckDuplicate={handleCheckNickname}
            showCheckButton
            isValid={nicknameValid}
            error={nicknameError} // ✅ 에러 상태 내려줌 (IdInputGroup에서 색상 처리)
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
              disabled={submitting}
            >
              {submitting ? "가입 중..." : "가입"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}