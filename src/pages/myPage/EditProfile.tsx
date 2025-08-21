import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "../../styles/myPage/EditProfile.module.css";
import IdInputGroup from "../../components/signUp/IdInputGroup";
import PasswordInputGroup from "../../components/signUp/PasswordInputGroup";
import BirthCalendar from "../../components/signUp/BirthCalendar";
import Profile from "../../components/signUp/Profile";
import Gender from "../../components/signUp/Gender";
import { fetchMe, updateMe, type MeResponse } from "../../apis/mypage/users";
import { getImage } from "../../apis/common/File";
import axios from "axios";
import { useNavbar } from "../../hooks/NavbarContext";

// function toYYYYMMDD(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

function parseYYYYMMDDToDate(str: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const dt = new Date(str);
  return isNaN(dt.getTime()) ? null : dt;
}

function adjustBirthdayForTimezone(birthday: Date): string {
  // 24시간(밀리초)을 더해서 다음 날로 조정
  const adjustedDate = new Date(birthday.getTime() + 24 * 60 * 60 * 1000);
  return adjustedDate.toISOString().split("T")[0];
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { setActiveTab } = useNavbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [emailMessage, setEmailMessage] = useState("*이메일을 입력하세요.");
  const [nicknameMessage, setNicknameMessage] = useState("*10글자 내");
  const [passwordMessage, setPasswordMessage] = useState(
    "*영어 소문자, 숫자, 특수기호 조합 최소 8자 이상"
  );
  const [confirmPasswordMessage, setConfirmPasswordMessage] =
    useState("*비밀번호를 다시 입력하세요.");

  const [emailValid, setEmailValid] = useState(false);
  const [nicknameValid, setNicknameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  //  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (value === "") {
      setPasswordMessage("*영어 소문자, 숫자, 특수기호 조합 최소 8자 이상");
      setPasswordValid(false);
    } else if (regex.test(value)) {
      setPasswordMessage("*사용 가능한 비밀번호입니다.");
      setPasswordValid(true);
    } else {
      setPasswordMessage("*비밀번호 조건에 충족하지 않습니다.");
      setPasswordValid(false);
    }
  };

  const validateConfirmPassword = (value: string) => {
    if (value === "") {
      setConfirmPasswordMessage("*비밀번호를 다시 입력하세요.");
      setPasswordsMatch(false);
    } else if (value === password) {
      setConfirmPasswordMessage("*비밀번호가 일치합니다.");
      setPasswordsMatch(true);
    } else {
      setConfirmPasswordMessage("*비밀번호가 일치하지 않습니다.");
      setPasswordsMatch(false);
    }
  };

  const validateNickname = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setNicknameMessage("*10글자 내");
      setNicknameValid(false);
      return;
    }
    if (trimmed.length > 10) {
      setNicknameMessage("*닉네임 조건에 충족하지 않습니다.");
      setNicknameValid(false);
      return;
    }
    setNicknameMessage("*10글자 내");
    setNicknameValid(false);
  };

  const handleCheckEmail = () => {
    if (!email) {
      setEmailMessage("*이메일을 입력하세요.");
      setEmailValid(false);
      return;
    }
    setEmailMessage("*사용 가능한 아이디입니다.");
    setEmailValid(true);
  };

  const handleCheckNickname = async () => {
    const trimmed = nickname.trim();

    if (trimmed.length === 0) {
      setNicknameMessage("*닉네임을 입력하세요.");
      setNicknameValid(true);
      return;
    }
    if (trimmed.length > 10) {
      setNicknameMessage("*닉네임 조건에 충족하지 않습니다.");
      setNicknameValid(true);
      return;
    }
    setNicknameValid(true);

    try {
      const res = await axios.get("/api/auth/nickname-exist", {
        params: { nickname: trimmed },
      });

      if (res?.data?.exist) {
        setNicknameMessage("*중복되는 닉네임입니다.");
        setNicknameValid(true);
      } else {
        setNicknameMessage("*사용 가능한 닉네임입니다.");
        setNicknameValid(true);
      }
    } catch {
      setNicknameMessage("*중복 확인 중 오류가 발생했습니다.");
      setNicknameValid(true);
    }
  };

  useEffect(() => {
    let alive = true;
    let revokeUrl: string | null = null;

    (async () => {
      try {
        const me: MeResponse = await fetchMe();
        if (!alive) return;

        setEmail(me.email || "");
        setNickname(me.nickname || "");
        setGender(me.gender || null);

        const rawBirthday =
          (me as any).birthday ??
          (me as any).birthDate ??
          (me as any).dateOfBirth ??
          null;

        if (typeof rawBirthday === "string") {
          const parsed = parseYYYYMMDDToDate(rawBirthday);
          if (parsed) setBirthday(parsed);
        }

        const img = (me as any).profileImage;
        const uuid: string | undefined = img?.uuid;
        const handlingType: string | undefined = img?.handlingType;

        if (uuid && handlingType === "IMAGE") {
          try {
            const url = await getImage(uuid);
            if (!alive) return;
            setProfileImageUrl(url);
            if (url?.startsWith("blob:")) revokeUrl = url;
          } catch {
            if (!alive) return;
            setProfileImageUrl(null);
          }
        } else {
          setProfileImageUrl(null);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.response?.data?.message || "내 정보 불러오기에 실패했습니다.");
      }
    })();


    return () => {
      alive = false;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, []);

  const canSubmit =
    (password === "" && confirmPassword === "") ||
    (passwordValid && passwordsMatch);

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);

    try {
      const payload: any = {
        email,
        nickname,
        birthday: birthday ? adjustBirthdayForTimezone(birthday) : undefined,
      };

      if (password) payload.password = password;
      if (profileImage) payload.profileImage = profileImage;

      await updateMe(payload);
      alert("내 정보가 수정되었습니다.");
      setActiveTab("마이페이지");
      navigate("/myPage");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "수정 중 오류가 발생했습니다.";

      if (msg.includes("닉네임")) {
        setNicknameMessage(`*${msg}`);
        setNicknameValid(true);
      } else if (msg.includes("이메일")) {
        setEmailMessage(`*${msg}`);
        setEmailValid(true);
      } else {
        alert(msg);
      }
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
      <Header />
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.title}>프로필 수정</div>

          <IdInputGroup
            label="아이디"
            placeholder="이메일을 입력하세요."
            message={emailMessage}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailMessage("*이메일을 입력하세요.");
              setEmailValid(false);
            }}
            showCheckButton
            onCheckDuplicate={handleCheckEmail}
            isValid={emailValid}
          />

          <PasswordInputGroup
            label="비밀번호"
            placeholder="비밀번호를 입력하세요."
            message={passwordMessage}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
              validateConfirmPassword(confirmPassword);
            }}
          />

          <PasswordInputGroup
            label="비밀번호 재확인"
            placeholder="비밀번호를 다시 입력하세요."
            message={confirmPasswordMessage}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(e.target.value);
            }}
          />

          <IdInputGroup
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            message={nicknameMessage}
            type="text"
            value={nickname}
            onChange={(e) => {
              const v = e.target.value;
              setNickname(v);
              validateNickname(v);
            }}
            showCheckButton
            onCheckDuplicate={handleCheckNickname}
            isValid={nicknameValid}
          />

          <BirthCalendar value={birthday} onChange={setBirthday} />

          <Gender selected={gender} onSelect={setGender} />

          <Profile
            onImageChange={setProfileImage}
            initialImage={profileImageUrl}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            type="button"
            className={styles.button}
            disabled={!canSubmit || saving}
            onClick={handleSubmit}
          >
            {saving ? "저장 중..." : "완료"}
          </button>
        </div>
      </div>
    </>
  );
}
