import styles from "../../styles/common/GroupCard.module.css";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useCallback } from "react";

interface GroupCardProps {
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  categories?: string[];
  image: string;
  isBookmarked?: boolean;
  type?: 'joined' | 'hosted' | 'applied';
  onBookmarkClick?: () => void;
  onClick?: () => void;
}

export default function GroupCard({
  label, count, title, subtitle, person,
  categories, image, isBookmarked, onBookmarkClick, onClick
}: GroupCardProps) {

  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkClick?.();
  }, [onBookmarkClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageWrapper}>
        <img src={image} alt="카드 이미지" className={styles.image} />
        {isBookmarked ? (
          <FaBookmark className={`${styles.bookmark} ${styles.filled}`} onClick={handleBookmarkClick}/>
        ) : (
          <FaRegBookmark className={`${styles.bookmark} ${styles.outlined}`} onClick={handleBookmarkClick}/>
        )}
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
          {(categories ?? []).map((c, idx) => (
            <span key={idx}>#{c}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
