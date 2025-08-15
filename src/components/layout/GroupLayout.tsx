// src/components/layout/GroupLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import FixedBanner from "../fixedGroupHeader/FixedBanner";
import ParticipantMenu from "../fixedGroupHeader/ParticipantMenu";
import styles from "./GroupLayout.module.css";

export default function GroupLayout() {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdParam);

  // groupId 검증
  if (!groupIdParam || Number.isNaN(groupId)) {
    return (
      <div className={styles.layout__wrapper}>
        <main className={styles.main__content}>
          잘못된 그룹 ID 입니다.
        </main>
      </div>
    );
  }

  return (
    <>
      {/* 상단 고정 배너 */}
      <FixedBanner groupId={groupId} />

      <div className={styles.layout__wrapper}>
        <div className={styles.menu__container}>
          <ParticipantMenu />
        </div>

        <main className={styles.main__content}>
          <Outlet />
        </main>
      </div>
    </>
  );
}