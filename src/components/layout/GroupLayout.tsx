import { Outlet, useParams } from "react-router-dom";
import FixedBanner from "../fixedGroupHeader/FixedBanner";
import ParticipantMenu from "../fixedGroupHeader/ParticipantMenu";
import styles from "./GroupLayout.module.css";
import { useIsGroupOwner } from "../../hooks/useMyGroup";

export default function GroupLayout() {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdParam);
  const { isOwner } = useIsGroupOwner(groupIdParam!);

  if (!groupIdParam || Number.isNaN(groupId)) {
    return (
      <div className={styles.layout__wrapper}>
        <main className={styles.main__content}>잘못된 그룹 ID 입니다.</main>
      </div>
    );
  }

  return (
    <div className={styles.layout__container}>
      <FixedBanner groupId={groupId} isOwner={isOwner} />
      <div className={styles.layout__wrapper}>
        <div className={styles.layout__wrapper2}>
          <div className={styles.menu__container}>
            <ParticipantMenu isOwner={isOwner} />
          </div>
          <main className={styles.main__content}>
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}