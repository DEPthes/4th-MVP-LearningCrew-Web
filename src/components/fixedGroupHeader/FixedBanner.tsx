import styles from "../../styles/fixedGroupHeader/FixedBanner.module.css"
import Bookmark from "../../assets/Bookmark.svg"
import Step from "./Step"

export default function FixedBanner() {
  return (
    <>
    <div className={styles.page__page__wrapper}>
    <div className={styles.page__wrapper}>
      <div className={styles.div__container}>
        <div className={styles.container__1}>
          <div className={styles.container__2}>
            <div className={styles.title}>같이 공부 해요</div>
            <div className={styles.introduce}>스터디가 처음이신 분들 함께해요!</div>
          </div>

          <div className={styles.container__3}>
            <div className={styles.hostName}>@아무개</div>
          </div>

          <div className={styles.container__4}>
            <div className={styles.study__people}>스터디 정원</div>
            <div className={styles.study__people__info}>14/16</div>
          </div>

          <div className={styles.container__5}>
            <div className={styles.study__date}>스터디 일정</div>
            <div className={styles.study__date__info}>25.07.11~25.08.20</div>
          </div>

          <div className={styles.container__6}>
            <button className={styles.Bookmark}>
              <img src={Bookmark} alt="북마크" />
            </button>
            <button className={styles.button}>가입 신청</button>
          </div>
        </div>

        <div className={styles.category__container}>
          <div className={styles.categories}># IT</div>
          <div className={styles.categories}># 안드로이드</div>
          <div className={styles.categories}># 프론트</div>
        </div>
      </div>
    </div>
        <div className={styles.step__wrapper}>
            <Step totalSteps={6} currentStep={2} />
        </div>
    </div>
    </>
  )
}