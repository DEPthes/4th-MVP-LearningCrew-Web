// src/components/fixedGroupHeader/ParticipantMenu.tsx
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/ParticipantMenu.module.css";

export default function ParticipantMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();

  // 기본 메뉴
  const menuItems = [
    { name: "Study", path: `/group/${groupId}/step/${stepId}/MyGroupStudy` },
    { name: "내 노트", path: `/group/${groupId}/step/${stepId}/myNote` },
    { name: "공유 노트", path: `/group/${groupId}/step/${stepId}/shareNote` },
    { name: "Q&A", path: `/group/${groupId}/step/${stepId}/QandA` },
    { name: "Quiz", path: `/group/${groupId}/step/${stepId}/quiz` },
  ];

  // 호스트 전용: Member 묶음 (참여자/신청자)
  // const hostItems = [
  //   { name: "Member - 참여자", path: `/group/${groupId}/step/${stepId}/members` },
  //   { name: "Member - 신청자", path: `/group/${groupId}/step/${stepId}/applicants` },
  // ];

  // 지금 페이지와 일치하면 활성화
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className={styles.menu__container}>
      {menuItems.map((item) => (
        <button
          key={item.name}
          className={`${styles.button} ${isActive(item.path) ? styles.button__active : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </button>
      ))}

      {/* Member 영역(호스트 전용으로 쓰더라도 지금은 항상 노출) */}
      {/* <div className={styles.member__group__label}>Member</div>
      {hostItems.map((item) => (
        <button
          key={item.name}
          className={`${styles.button} ${isActive(item.path) ? styles.button__active : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </button>
      ))} */}
    </div>
  );
}