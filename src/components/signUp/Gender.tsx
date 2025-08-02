import { useState } from "react"
import styles from "../../styles/signUp/Gender.module.css"

export default function Gender() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (gender: string) => {
    setSelected(gender)
  }

  return (
    <div className={styles.div__container}>
      <div className={styles.label}>성별</div>
      <div className={styles.info}>*성별을 선택하세요.</div>
      <div className={styles.button__container}>
        {["남자", "여자", "기타"].map((gender) => (
          <button
            key={gender}
            className={`${styles.button} ${selected === gender ? styles.active : ""}`}
            onClick={() => handleClick(gender)}
          >
            {gender}
          </button>
        ))}
      </div>
    </div>
  )
}