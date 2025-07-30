import styles from "../../styles/common/List.module.css";

interface ListItem {
  id: number;
  title: string;
  writer: string;
  createdAt: string;
}

interface ListProps {
  pagenation: boolean;
  items: ListItem[];
  handleClick: (id: number) => void;
}

export const List = ({ pagenation, items, handleClick }: ListProps) => {
  return (
    <div className={styles.list__container}>
      <div className={styles.list__container}>
        <div className={styles.list__header}>
          <p className={styles.list__header_title}>제목</p>
          <p className={styles.list__header_writer}>작성자</p>
          <p className={styles.list__header_date}>작성일</p>
        </div>
        <div className={styles.list__body}>
          {items.map((list, index) => (
            <div
              key={index}
              className={styles.list__row}
              onClick={() => handleClick(list.id)}
            >
              <p className={styles.list__title}>{list.title}</p>
              <p className={styles.list__writer}>{list.writer}</p>
              <p className={styles.list__createdAt}>{list.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}