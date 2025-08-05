import styles from "../../styles/common/GroupCard.module.css";
import { CiBookmark } from "react-icons/ci";

interface GroupCardProps {
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  tags: string[];
  image: string;
}

export default  function GroupCard ({ label, count, title, subtitle, person, tags, image }: GroupCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt="카드 이미지" className={styles.image} />
        <CiBookmark className={styles.bookmark} />
        <div className={styles.label}>{label}</div>
        <div className={styles.count}>{count}</div>
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <div className={styles.inform}>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.person}>{person}</p>
        </div>
        <div className={styles.tags}>
          {tags.map((tag, idx) => (
          <span key={idx}>#{tag}</span>
        ))}
        </div>
      </div>
    </div>
  );
};