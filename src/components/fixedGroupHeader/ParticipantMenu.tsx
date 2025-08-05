import { useState } from "react"
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css"

export default function HostMenu() {
  const [activeTab, setActiveTab] = useState("Study");

  const menuItems = ["Study", "내 노트", "공유 노트", "Q&A", "Quiz"];

  return (
    <div className={styles.menu__container}>
      {menuItems.map((item) => (
        <button
          key={item}
          className={`${styles.button} ${activeTab === item ? styles.button__active : ""}`}
          onClick={() => setActiveTab(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}