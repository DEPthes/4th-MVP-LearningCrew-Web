import styles from "../../styles/common/List.module.css";
import { Pagenation } from "./Pagenation";
import { useEffect, useState } from "react";

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
  sort: string;
}

export const List = ({ pagenation, items, handleClick, sort }: ListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentItems, setCurrentItems] = useState<ListItem[]>([]);
  const [sortedItems, setSortedItems] = useState<ListItem[]>(items);

  useEffect(() => {
    setTotalPages(Math.ceil(items.length / 20));
  }, [items])

  useEffect(() => {
    if (!pagenation) setCurrentItems(sortedItems);
    else {
      const top = items.length - (currentPage - 1) * 20;
      const bottom = top - 20 > 0 ? top - 20 : 0;
      setCurrentItems(sortedItems.slice(bottom, top).reverse());
    }
  }, [currentPage, sortedItems])

  useEffect(() => {
    if (sort == "오래된순") {
      setSortedItems([...items].reverse());
    } else if (sort == "관련도순") {
      // setSortedItems([...items].sort((a, b) => a.title.localeCompare(b.title)));
    } else if (sort == "가나다순") {
      setSortedItems([...items].sort((a, b) => b.title.localeCompare(a.title)));
    } else {
      setSortedItems([...items]);
    }
  }, [sort, items])

  return (
    <div className={styles.list__container}>
      <div className={styles.list__container}>
        <div className={styles.list__header}>
          <p className={styles.list__header_title}>제목</p>
          <p className={styles.list__header_writer}>작성자</p>
          <p className={styles.list__header_date}>작성일</p>
        </div>
        <div className={styles.list__body}>
          {currentItems.map((list, index) => (
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
      {pagenation ?
        <Pagenation currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        : <></>}
    </div>
  )
}