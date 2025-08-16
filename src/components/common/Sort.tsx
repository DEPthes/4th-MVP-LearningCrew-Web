import { useState } from "react";
import styles from "../../styles/common/Sort.module.css"
import DownArrow from "../../assets/DownArrow.svg";
import UpArrow from "../../assets/UpArrow.svg";
import Click from "../../assets/SortClick.svg";
import UnClick from "../../assets/SortNonClick.svg";

interface SortProps {
  sort: string,
  setSort: (sort: string) => void,
  isGroup?: boolean,
}

export const Sort = ({ sort, setSort, isGroup }: SortProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleBtnClick = () => {
    setIsOpen(!isOpen);
  }

  const handleSortClick = (sort: "최신순" | "오래된순" | "관련도순" | "가나다순") => {
    setSort(sort);
    setIsOpen(false);
  }

  return (
    <div className={styles.sort__container}>
      <div className={styles.sort__top} style={{ marginBottom: isGroup ? "0px" : "20px" }}>
        {sort}
        <button onClick={handleBtnClick} className={styles.sort__btn}>
          {isOpen ? <img src={UpArrow} />
            : <img src={DownArrow} />}
        </button>
      </div>
      {isOpen ?
        <div className={styles.sort__list} style={{ marginTop: isGroup ? "20px" : "0" }}>
          <div onClick={() => handleSortClick("최신순")} className={styles.sort__list__item}>
            {sort === "최신순" ?
              <img src={Click} />
              : <img src={UnClick} />}
            <p>최신순</p>
          </div>
          <div onClick={() => handleSortClick("오래된순")} className={styles.sort__list__item}>
            {sort === "오래된순" ?
              <img src={Click} />
              : <img src={UnClick} />}
            <p>오래된순</p>
          </div>
          {isGroup && <div onClick={() => handleSortClick("관련도순")} className={styles.sort__list__item}>
            {sort === "관련도순" ?
              <img src={Click} />
              : <img src={UnClick} />}
            <p>관련도순</p>
          </div>}
          <div onClick={() => handleSortClick("가나다순")} className={styles.sort__list__item}>
            {sort === "가나다순" ?
              <img src={Click} />
              : <img src={UnClick} />}
            <p>가나다순</p>
          </div>
        </div>
        : <></>}
    </div>
  )
}