import styles from "../../styles/pages/myPage/myPageStyle.module.css";
import { MdNavigateNext } from "react-icons/md";
import profile from '../../assets/profile.svg';

const MyPage = () => {
  return (
    <main className={styles.container}>
      {/* 찜 그룹 */}
      <section className={styles.section}>
        <h2 className={styles.title}>찜 그룹</h2>
        <hr></hr>
        <div className={styles.groupButtonWrapper}>
          <button className={styles.groupButton}>찜 그룹 리스트 확인하기 
              <MdNavigateNext className={styles.groupIcon} />
          </button>
        </div>
      </section>

      {/* 내 프로필 */}
      <section className={styles.section}>
        <h2 className={styles.title}>내 프로필</h2>
        <hr></hr>
        <div className={styles.profileBox}>
            <div className={styles.profileContent}>
                {/* 프로필 이미지 + 필드 */}
              <div className={styles.profileLeft}>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>프로필 사진</label>
                    <div className={styles.profile}>
                      <img src={profile} alt="프로필" className={styles.profileImage} />
                    </div>
                </div>

                <div className={styles.profileFields}>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>닉네임</label>
                    <p className={styles.leftTextValue}>아무개 님</p>
                  </div>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>생년월일</label>
                    <p className={styles.leftTextValue}>2005. 07. 07</p>                    
                  </div>
                  <div className={styles.fieldRow}>
                    <label className={styles.label}>성별</label>
                    <p className={styles.leftTextValue}>여자</p>
                  </div>
                </div>
              </div>

                {/* ID, 비밀번호 */}
              <div className={styles.profileRight}>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>ID</label>
                    <p className={styles.rightTextValue}>learnit</p>
                </div>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>비밀번호</label>
                    <p className={styles.rightTextValue}>********</p>
                </div>
              </div>
            </div>

            <div className={styles.buttonRow}>
                <button className={styles.save}>수정</button>
            </div>
          </div>
      </section>
      <button className={styles.logout}>로그아웃</button>
    </main>
  );
};

export default MyPage;