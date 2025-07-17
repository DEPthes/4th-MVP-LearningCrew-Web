import styles from '../../styles/pages/home/HomePageStyle.module.css';

export const Home = () => {
  return (
    // 사실 module css 쓰면 bem 방법론 안써도 될 것 같긴합니당 본인이 사용하기에 편한걸로 사용하세여
    <div className={styles.homePage__container}>
      <p className={styles.homePage__title}>Home</p>
      <p className={styles.homePage__subTitle}>Home1</p>
      <p className={styles.homePage__subTitle2}>Home2</p>
    </div>
  );
}