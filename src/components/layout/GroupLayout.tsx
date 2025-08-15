// src/components/layout/GroupLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import FixedBanner from "../fixedGroupHeader/FixedBanner";
import ParticipantMenu from "../fixedGroupHeader/ParticipantMenu";
import styles from "./GroupLayout.module.css";

export default function GroupLayout() {
  // 라우트가 /groups/:groupId 형태라고 가정
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdParam);

  // groupId 검증
  if (!groupIdParam || Number.isNaN(groupId)) {
    return (
      <>
        <Navbar />
        <div className={styles.layout__wrapper}>
          <main className={styles.main__content}>
            <p>잘못된 그룹 ID 입니다.</p>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ✅ FixedBanner에 groupId 전달 */}
      <FixedBanner groupId={groupId} />

      <div className={styles.layout__wrapper}>
        <div className={styles.menu__container}>
          {/* 필요하다면 ParticipantMenu에도 groupId 넘겨서 내부에서 활용 가능 */}
          <ParticipantMenu />
        </div>

        <main className={styles.main__content}>
          <Outlet />
        </main>
      </div>
    </>
  );
}