import { useEffect, useState } from "react";
import styles from "../../styles/myPage/MyPage.module.css";
import { MdNavigateNext } from "react-icons/md";
import profilePlaceholder from "../../assets/default-profile.svg";
import { Link } from "react-router-dom";
import { fetchMe, type MeResponse } from "../../apis/mypage/users";
import { getImage } from "../../apis/common/File";
import { logout } from "../../apis/auth/auth";

function formatGender(g: MeResponse["gender"]) {
  const key = (g || "").toString().toUpperCase();
  if (key === "MALE") return "남자";
  if (key === "FEMALE" || key === "FEMAIL") return "여자";
  if (!g) return "-";
  return "기타";
}

function formatBirthday(me: Partial<MeResponse> | any) {
  const raw = me?.birthday ?? me?.birthDate ?? me?.dateOfBirth;
  if (!raw) return "-";
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) {
    return String(raw);
  }
  return dt.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function MyPageHome() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(profilePlaceholder);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        setMe(data);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401) {
          setMe(null);
          setErr(null);
        } else {
          setErr(e?.response?.data?.message || "내 정보 불러오기에 실패했어요.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let alive = true;
    let revokeUrl: string | null = null;

    (async () => {
      const uuid = (me as any)?.profileImage?.uuid;
      const isImage = (me as any)?.profileImage?.handlingType === "IMAGE";

      if (!uuid || !isImage) {
        setImgSrc(profilePlaceholder);
        return;
      }
      try {
        const url = await getImage(uuid);
        if (!alive) return;
        setImgSrc(url || "");
        if (url?.startsWith("blob:")) revokeUrl = url;
      } catch {
        if (!alive) return;
        setImgSrc(profilePlaceholder);
      }
    })();

    return () => {
      alive = false;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [me?.profileImage?.uuid, (me as any)?.profileImage?.handlingType]);

  useEffect(() => {
    const onLogout = () => {
      setMe(null);
      setImgSrc(profilePlaceholder);
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMe(null);
    setImgSrc(profilePlaceholder);
  };

  const idLabel = me?.email ? me.email : "-";

  if (loading) {
    return (
      <main className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.title}>내 프로필</h2>
          <hr />
          <div className={styles.profileBox}>
            <div className={styles.profileContent}>
              <div className={styles.profileLeft}>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>프로필 사진</label>
                  <div className={styles.profile}>
                    <div className={styles.skeletonCircle} />
                  </div>
                </div>
                <div className={styles.profileFields}>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>닉네임</label>
                    <p className={styles.leftTextValue}>불러오는 중…</p>
                  </div>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>생년월일</label>
                    <p className={styles.leftTextValue}>-</p>
                  </div>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>성별</label>
                    <p className={styles.leftTextValue}>-</p>
                  </div>
                </div>
              </div>
              <div className={styles.profileRight}>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>ID</label>
                  <p className={styles.rightTextValue}>불러오는 중…</p>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>비밀번호</label>
                  <p className={styles.rightTextValue}>********</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 비로그인/토큰만료 전용 화면
  if (!me && !err) {
    return (
      <main className={styles.container}>
        <section className={styles.logoutWrap}>
          <div className={styles.logoutCard}>
            <p className={styles.logoutTitle}>로그인 후 확인 가능합니다</p>
            <p className={styles.logoutSub}>
              원활한 서비스 이용을 위해서 로그인 후 이용해 주세요
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (err) {
    return (
      <main className={styles.container}>
        <p style={{ color: "crimson" }}>{err}</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* 찜 그룹 */}
      <section className={styles.section}>
        <h2 className={styles.title}>찜 그룹</h2>
        <hr />
        <div className={styles.groupButtonWrapper}>
          <Link to="/mypage/favorite" className={styles.groupButton}>
            찜 그룹 리스트 확인하기
            <MdNavigateNext className={styles.groupIcon} />
          </Link>
        </div>
      </section>

      {/* 내 프로필 */}
      <section className={styles.section}>
        <h2 className={styles.title}>내 프로필</h2>
        <hr />
        <div className={styles.profileBox}>
          <div className={styles.profileContent}>
            <div className={styles.profileLeft}>
              <div className={styles.fieldRow}>
                <label className={styles.label}>프로필 사진</label>
                <div className={styles.profile}>
                  <img src={imgSrc} alt="프로필" className={styles.profileImage} />
                </div>
              </div>

              <div className={styles.profileFields}>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>닉네임</label>
                  <p className={styles.leftTextValue}>{me?.nickname ?? "로그인 필요"}</p>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>생년월일</label>
                  <p className={styles.leftTextValue}>{formatBirthday(me)}</p>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>성별</label>
                  <p className={styles.leftTextValue}>{formatGender((me as any)?.gender)}</p>
                </div>
              </div>
            </div>

            <div className={styles.profileRight}>
              <div className={styles.fieldRow}>
                <label className={styles.label}>ID</label>
                <p className={styles.rightTextValue}>{idLabel}</p>
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label}>비밀번호</label>
                <p className={styles.rightTextValue}>********</p>
              </div>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <Link to="/myPage/edit" className={styles.save}>
              수정
            </Link>
          </div>
        </div>
      </section>

      <button
        className={styles.logout}
        onClick={handleLogout}
        disabled={!me}
        aria-disabled={!me}
        title={me ? "로그아웃" : "이미 로그아웃 상태입니다"}
      >
        로그아웃
      </button>
    </main>
  );
}
