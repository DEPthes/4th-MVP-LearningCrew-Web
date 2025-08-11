import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css";
import ArrowLeft from "../../assets/ArrowLeft.svg";

export default function HostMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams<{ groupId: string }>();

  const menuItems = [
    { name: "Study", path: `/group/${groupId}/MyGroupStudy` },
    { name: "내 노트", path: `/group/${groupId}/myNote` },
    { name: "공유 노트", path: `/group/${groupId}/shareNote` },
    { name: "Q&A", path: `/group/${groupId}/QandA` },
    { name: "Quiz", path: `/group/${groupId}/quiz` },
  ];

  const detailItems = [
    { path: `/group/${groupId}/myNote/write`, previousPath: `/group/${groupId}/myNote` },
    { path: `/group/${groupId}/shareNoteDetail/[^/]+`, previousPath: `/group/${groupId}/shareNote` },
    { path: `/group/${groupId}/QandA/write`, previousPath: `/group/${groupId}/QandA` },
    { path: `/group/${groupId}/QandADetail/[^/]+`, previousPath: `/group/${groupId}/QandA` },
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