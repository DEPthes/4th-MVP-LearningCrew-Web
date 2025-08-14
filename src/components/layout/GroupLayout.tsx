// components/layout/GroupLayout.tsx
import FixedBanner from "../fixedGroupHeader/FixedBanner";
import ParticipantMenu from "../fixedGroupHeader/ParticipantMenu"
import { Outlet } from "react-router-dom";
import styles from "./GroupLayout.module.css"

export default function GroupLayout() {
  return (
    <>
      <FixedBanner />
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