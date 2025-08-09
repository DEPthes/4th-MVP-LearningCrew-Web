import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/common/Navbar.module.css";
import SearchBar from "../common/SearchBar";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const emitSearch = (query: string) => {
    navigate({
      pathname,
      search: query ? `?q=${encodeURIComponent(query)}` : "",
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} />
        </div>

        <div className={styles.menu}>
          <NavLink to="/" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>홈</NavLink>
          <NavLink to="/mygroup" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>내 그룹</NavLink>
          <NavLink to="/mypage" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>마이페이지</NavLink>
        </div>

        <div className={styles.rightSection}>
          <SearchBar placeholder="스터디 이름을 검색해 보세요" onSearch={emitSearch} />
          <Link to="/login" className={styles.loginBtn}>로그인</Link>
        </div>
      </div>
    </nav>
  );
}