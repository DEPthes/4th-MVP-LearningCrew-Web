import styles from "../../styles/components/common/Footer.module.css";

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} />
          <div>
            <div className={styles.bar}></div> LearnIT 
            <div className={styles.bar}></div> Learn it with IT - IT를 통해 함께 배우다
          </div>
        </div>
        <hr></hr>
        <div className={styles.bottom}>
          <div>
            <p>(주)런잇 | 대표: 러닝크루</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 서대문구 거북골로 34</p>
            <p>이메일: 1234@learnit.co.kr</p>
          </div>
          <div>@2025 LearnIt</div>
        </div >
      </div>
    </footer>
    );
}