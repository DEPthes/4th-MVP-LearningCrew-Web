// src/components/fixedGroupHeader/ParticipantMenu.tsx
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css";
import ArrowLeft from "../../assets/ArrowLeft.svg";

export default function ParticipantMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();

  const menuItems = [
    { name: "Study", path: `/group/${groupId}/step/${stepId}/MyGroupStudy` },
    { name: "내 노트", path: `/group/${groupId}/step/${stepId}/myNote` },
    { name: "공유 노트", path: `/group/${groupId}/step/${stepId}/shareNote` },
    { name: "Q&A", path: `/group/${groupId}/step/${stepId}/QandA` },
    { name: "Quiz", path: `/group/${groupId}/step/${stepId}/quiz` },
  ];

  const detailItems = [
    { path: `/group/${groupId}/step/${stepId}/myNote/write`, previousPath: `/group/${groupId}/step/${stepId}/myNote` },
    { path: `/group/${groupId}/step/${stepId}/shareNoteDetail/[^/]+`, previousPath: `/group/${groupId}/step/${stepId}/shareNote` },
    { path: `/group/${groupId}/step/${stepId}/QandA/write`, previousPath: `/group/${groupId}/step/${stepId}/QandA` },
    { path: `/group/${groupId}/step/${stepId}/QandADetail/[^/]+`, previousPath: `/group/${groupId}/step/${stepId}/QandA` },
  ];

  const isDetailPath = detailItems.some(item => {
    const regex = new RegExp(`^${item.path}$`);
    return regex.test(location.pathname);
  });

  const currentDetailItem = detailItems.find(item => {
    const regex = new RegExp(`^${item.path}$`);
    return regex.test(location.pathname);
  });

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