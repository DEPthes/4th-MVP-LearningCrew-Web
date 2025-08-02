import { useState } from "react"
import styles from "../../styles/hostGroupParticipants/HostGroupParticipants.module.css"
import ParticipantList from "./ParticipantList"
import { Sort } from "../common/Sort"
import { Pagenation } from "../common/Pagenation"

export default function HostGroupParticipants() {
  const [activeTab, setActiveTab] = useState<"participant" | "applicant">("participant")
  const [sort, setSort] = useState("최신순")
  const [currentPage, setCurrentPage] = useState(1)        
  const totalPages = 5 

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.button__container}>
          <button
            className={`${styles.tab} ${
              activeTab === "participant" ? styles.tab__active : ""
            }`}
            onClick={() => setActiveTab("participant")}
          >
            <span
              className={`${styles.dot} ${
                activeTab === "participant" ? styles.dot__active : ""
              }`}
            ></span>
            참여자
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "applicant" ? styles.tab__active : ""
            }`}
            onClick={() => setActiveTab("applicant")}
          >
            <span
              className={`${styles.dot} ${
                activeTab === "applicant" ? styles.dot__active : ""
              }`}
            ></span>
            신청자
          </button>
        </div>
        <Sort sort={sort} setSort={setSort} />
      </div>

      <div className={styles.list__wrapper}>
        <div className={styles.list__header}>
          <div className={styles.header__th__nickname}>닉네임</div>
          <div className={styles.header__th__gender}>성별</div>
          <div className={styles.header__th__date}>가입일자</div>
        </div>
      </div>
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <ParticipantList />
      <div>
        <Pagenation
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  )
}