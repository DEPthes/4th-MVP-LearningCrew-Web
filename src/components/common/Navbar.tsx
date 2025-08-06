import { NavLink, Link } from "react-router-dom";
import styles from "../../styles/common/Navbar.module.css";
import { MdOutlineSearch } from "react-icons/md";

export default function Navbar() {
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* 로고 */}
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} />
        </div>

        {/* 메뉴 */}
        <div className={styles.menu}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            홈
          </NavLink>
          <NavLink
            to="/GroupLayout"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            내 그룹
          </NavLink>
          <NavLink
            to="/mypage"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            마이페이지
          </NavLink>
        </div>


        <div className={styles.rightSection}>
          {/* 검색 */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="스터디 이름을 검색해 보세요"
              className={styles.searchInput}
            />
            <MdOutlineSearch className={styles.searchIcon}/>
          </div>

          {/* 로그인 */}
          <Link to="/login" className={styles.loginBtn}>로그인</Link>
        </div>
      </div>
    </nav>
  );
}
