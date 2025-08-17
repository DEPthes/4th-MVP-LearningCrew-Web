import styles from "../../styles/common/GroupCard.module.css";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useCallback, useState } from "react";
import { postBookmark } from "../../apis/common/Bookmark";

interface GroupCardProps {
  id: number;
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  categories?: string[];
  image: string;
  isBookmarked?: boolean;
  type?: 'joined' | 'hosted' | 'applied';
  onClick?: () => void;
  onBookmarkClick?: (id: number) => void;
}

export default function GroupCard({
  id, label, count, title, subtitle, person,
  categories, image, isBookmarked, onClick, onBookmarkClick
}: GroupCardProps) {
  const [isDibs, setIsDibs] = useState<boolean>(isBookmarked ?? false);

  const handleBookmarkClick = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    try {
      const response = await postBookmark(id.toString());
      setIsDibs(response);
    } catch (error) {
      console.error(error);
    }
  }

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
        {isDibs ? (
          <FaBookmark className={`${styles.bookmark} ${styles.filled}`} onClick={(e) => {
            handleBookmarkClick(e, id)
            onBookmarkClick?.(id)
          }} />
        ) : (
          <FaRegBookmark className={`${styles.bookmark} ${styles.outlined}`} onClick={(e) => {
            handleBookmarkClick(e, id)
            onBookmarkClick?.(id)
          }} />
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
