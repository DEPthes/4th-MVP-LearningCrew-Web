import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css";
import ArrowLeft from "../../assets/ArrowLeft.svg";

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

  const detailItems = [
    { path: '/GroupLayout/myNote/write', previousPath: '/GroupLayout/myNote' },
    { path: '/GroupLayout/shareNoteDetail/[^/]+', previousPath: '/GroupLayout/shareNote' },
    { path: '/GroupLayout/QandA/write', previousPath: '/GroupLayout/QandA' },
    { path: '/GroupLayout/QandADetail/[^/]+', previousPath: '/GroupLayout/QandA' },
  ];

  const isDetailPath = detailItems.some(item => {
    const regex = new RegExp(`^${item.path}$`);
    return regex.test(location.pathname);
  });

  const currentDetailItem = detailItems.find(item => {
    const regex = new RegExp(`^${item.path}$`);
    return regex.test(location.pathname);
  });

  // 뒤로가기 핸들러
  const handleBackClick = () => {
    if (currentDetailItem) {
      navigate(currentDetailItem.previousPath);
    }
  };

  return (
    <>
      {isDetailPath ? (
        <div className={styles.arrow__left__container} onClick={handleBackClick}>
          <img src={ArrowLeft} />
        </div>
      ) : (
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
      )}
    </>
  );
}