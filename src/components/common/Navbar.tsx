import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/common/Navbar.module.css";
import SearchBar from "../common/SearchBar";

export default function Navbar() {
  const navbarHeight = "116px";
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const emitSearch = (query: string) => {
    navigate({
      pathname,
      search: query ? `?q=${encodeURIComponent(query)}` : "",
    });
  };

  const isMyGroupActive =
    pathname === "/mygroup" || pathname.startsWith("/group/");

  return (
    <>
      <div style={{ height: navbarHeight }}></div>

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
              end
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.active : ""}`
              }
            >
              홈
            </NavLink>

            <NavLink
              to="/mygroup"
              className={() =>
                `${styles.menuItem} ${isMyGroupActive ? styles.active : ""}`
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

          {/* 우측: 검색 + 로그인 */}
          <div className={styles.rightSection}>
            <SearchBar
              placeholder="스터디 이름을 검색해 보세요"
              onSearch={emitSearch}
            />
            <Link to="/login" className={styles.loginBtn}>
              로그인
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
