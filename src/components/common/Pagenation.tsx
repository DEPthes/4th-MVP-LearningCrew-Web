import styles from "../../styles/common/Pagenation.module.css";
import ArrowLeft from "../../assets/ArrowLeft.svg";
import ArrowRight from "../../assets/ArrowRight.svg";

interface PagenationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagenation = ({ currentPage, totalPages, setCurrentPage }: PagenationProps) => {

  const handleClick = (direction: string) => {
    if (direction === "left" && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === "right" && currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  return (
    <div className={styles.pagenation__container}>
      <div className={styles.pagenation__arrow_container}>
        {currentPage != 1 ?
          <div className={styles.pagenation__arrow_left} onClick={() => handleClick("left")}>
            <img src={ArrowLeft} />
            <p>이전</p>
          </div>
          : <></>}
      </div>
      <div className={styles.pagenation__number}>
        <p className={styles.pagenation__current}>{currentPage}</p>
        <p className={styles.pagenation__total}>/ {totalPages}</p>
      </div>
      <div className={styles.pagenation__arrow_container}>
        <div className={styles.pagenation__arrow} onClick={() => handleClick("right")}>
          {currentPage != totalPages ?
            <>
              <p>다음</p>
              <img src={ArrowRight} />
            </>
            : <></>}
        </div>
      </div>
    </div>
  )
}