import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css";

export default function HostMenu() {
  const navigate = useNavigate();
  const location = useLocation();


  const menuItems = [
    { name: "Study", path: "/GroupLayout/MyGroupStudy" },
    { name: "내 노트", path: "/GroupLayout/myNote" },
    { name: "공유 노트", path: "/GroupLayout/shareNote" },
    { name: "Q&A", path: "/GroupLayout/QandA" },
    { name: "Quiz", path: "/GroupLayout/quiz" },
  ];

  return (
    <div className={styles.menu__container}>
      {menuItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);

        return (
          <button
            key={item.name}
            className={`${styles.button} ${isActive ? styles.button__active : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}