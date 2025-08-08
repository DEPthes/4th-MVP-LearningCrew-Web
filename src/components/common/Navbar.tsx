import { NavLink, Link } from "react-router-dom";
import styles from "../../styles/common/Navbar.module.css";
import { MdOutlineSearch } from "react-icons/md";
import { useState } from "react";

export default function Navbar() {
  const [q, setQ] = useState("");

  const emitSearch = () => {
    const query = q.trim();
    window.dispatchEvent(new CustomEvent("app:search", { detail: { query } }));
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} />
        </div>

        <div className={styles.menu}>
          <NavLink to="/" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>홈</NavLink>
          <NavLink to="/GroupLayout" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>내 그룹</NavLink>
          <NavLink to="/mypage" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>마이페이지</NavLink>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="스터디 이름을 검색해 보세요"
              className={styles.searchInput}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && emitSearch()}
            />
            <MdOutlineSearch className={styles.searchIcon} onClick={emitSearch}/>
          </div>
          <Link to="/login" className={styles.loginBtn}>로그인</Link>
        </div>
      </div>
    </nav>
  );
}
