import { useState } from "react"
import styles from "../../styles/fixedGroupHeader/HostMenu.module.css"

export default function HostMenu() {
  const [active, setActive] = useState("Member")

  const buttons = ["Member", "Study", "내 노트", "공유 노트", "Q&A", "Quiz"]

  return (
    <div className={styles.button__container}>
      {buttons.map((label) => (
        <button
          key={label}
          className={`${styles.button} ${active === label ? styles.button__active : ""}`}
          onClick={() => setActive(label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}