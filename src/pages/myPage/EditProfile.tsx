import { useState } from "react"
import Header from "../../components/header/Header"
import styles from "../../styles/myPage/EditProfile.module.css"
import IdInputGroup from "../../components/signUp/IdInputGroup"
import PasswordInputGroup from "../../components/signUp/PasswordInputGroup"
import Date from "../../components/signUp/BirthCalendar"
import Profile from "../../components/signUp/Profile"
import Gender from "../../components/signUp/Gender"

export default function EditProfile() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [, setProfileImage] = useState<File | null>(null)

  return (
    <>
      <Header />
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.title}>프로필 수정</div>

          {/* 아이디 */}
          <IdInputGroup
            label="아이디"
            placeholder="이메일을 입력하세요."
            message="*아이디를 입력하세요."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 비밀번호 */}
          <PasswordInputGroup
            label="비밀번호"
            placeholder="비밀번호를 입력하세요."
            message="*영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 비밀번호 확인 */}
          <PasswordInputGroup
            label="비밀번호 재확인"
            placeholder="비밀번호를 다시 입력하세요."
            message="*비밀번호가 일치하지 않습니다."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* 닉네임 */}
          <IdInputGroup
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            message="*닉네임을 입력하세요."
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          {/* 생년월일 */}
          <Date value={birthday} onChange={setBirthday} />

          {/* 프로필 이미지 */}
          <Profile onImageChange={setProfileImage} />

          {/* 성별 선택 */}
          <Gender selected={gender} onSelect={setGender} />

          {/* 저장 버튼 */}
          <button type="submit" className={styles.button}>완료</button>
        </div>
      </div>
    </>
  )
}