import Header from "../../components/header/Header";
import styles from "../../styles/myPage/EditProfile.module.css";
import IdInputGroup from "../../components/signUp/IdInputGroup";
import PasswordInputGroup from "../../components/signUp/PasswordInputGroup";
import Date from "../../components/signUp/BirthCalendar";
import Profile from "../../components/signUp/Profile";
import Gender from "../../components/signUp/Gender";

export default function EditProfile() {
  return (
    <>
      <Header />
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.title}>프로필 수정</div>

          {/* 아이디 */}
          <IdInputGroup
            label="아이디"
            placeholder="이메일을 입력하세요"
            message="*아이디를 입력하세요."
            type="email"
          />

          {/* 비밀번호 */}
          <PasswordInputGroup
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            message="*영어 대소문자, 숫자, 특수기호 조합 최소 8자 이상"
            message2="*비밀번호를 입력하세요."
          />

          {/* 비밀번호 확인 */}
          <PasswordInputGroup
            label="비밀번호 재확인"
            placeholder="비밀번호를 다시 입력하세요."
            message="*비밀번호가 일치하지 않습니다."
          />

          {/* 닉네임 */}
          <IdInputGroup
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            message="*닉네임은 수정 가능합니다."
            type="text"
          />

          {/* 생년월일 */}
          <Date />

          {/* 프로필 이미지 */}
          <Profile />

          {/* 성별 선택 */}
          <Gender />

          {/* 저장 버튼 */}
          <button type="submit" className={styles.button}>완료</button>
        </div>
      </div>
    </>
  );
}
