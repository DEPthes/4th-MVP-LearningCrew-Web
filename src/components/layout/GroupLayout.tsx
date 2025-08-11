// components/layout/GroupLayout.tsx
import FixedBanner from "../fixedGroupHeader/FixedBanner";
import ParticipantMenu from "../fixedGroupHeader/ParticipantMenu"
import { Outlet } from "react-router-dom";
import styles from "./GroupLayout.module.css"
import Navbar from "../common/Navbar";

export default function GroupLayout() {
  return (
    <>
      <Navbar />
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