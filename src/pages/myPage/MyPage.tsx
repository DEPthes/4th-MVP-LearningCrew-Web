import { useEffect, useState } from "react";
import styles from "../../styles/myPage/MyPage.module.css";
import { MdNavigateNext } from "react-icons/md";
import profilePlaceholder from "../../assets/profile.svg";
import { Link } from "react-router-dom";
import { fetchMe, type MeResponse } from "../../apis/mypage/users";
import { getImage } from "../../apis/common/File";

function formatGender(g: MeResponse["gender"]) {
  const key = (g || "").toUpperCase();
  if (key === "MALE") return "남자";
  if (key === "FEMALE" || key === "FEMAIL") return "여자";
  return "기타";
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
        setErr(e?.response?.data?.message || "내 정보 불러오기에 실패했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let alive = true;
    let revokeUrl: string | null = null;

    (async () => {
      const uuid = me?.profileImage?.uuid;
      const isImage = me?.profileImage?.handlingType === "IMAGE";

      if (!uuid || !isImage) {
        setImgSrc(profilePlaceholder);
        return;
      }

      const url = await getImage(uuid); 
      if (!alive) return;

      setImgSrc(url);

      if (url.startsWith("blob:")) revokeUrl = url;
    })();

    return () => {
      alive = false;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [me?.profileImage?.uuid, me?.profileImage?.handlingType]);

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
            {/* 프로필 이미지 + 필드 */}
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
                  <p className={styles.leftTextValue}>{me?.nickname ?? "-"}</p>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>생년월일</label>
                  <p className={styles.leftTextValue}>-</p>
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>성별</label>
                  <p className={styles.leftTextValue}>{formatGender(me?.gender!)}</p>
                </div>
              </div>
            </div>

            {/* ID, 비밀번호 */}
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

      <button className={styles.logout}>로그아웃</button>
    </main>
  );
}
