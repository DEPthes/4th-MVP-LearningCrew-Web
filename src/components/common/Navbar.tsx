import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/common/Navbar.module.css";
import SearchBar from "../common/SearchBar";
import { useSearchKeyword } from "../../hooks/SearchKeywordContext";
import { useEffect, useState } from "react";
import {
  userStore,
  fetchMyProfile,
  hasAccessToken,
  type UserProfile,
} from "../../apis/auth/auth";
import { getImage } from "../../apis/common/File";

const DEFAULT_PROFILE =
  (() => {
    try {
      const base = (typeof import.meta !== "undefined" && (import.meta as any).env?.BASE_URL) || (typeof document !== "undefined" ? document.baseURI : "/");
      return new URL("default-profile.svg", base).toString();
    } catch {
      return "/default-profile.svg";
    }
  })();


export default function Navbar() {
  const navbarHeight = "116px";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { searchKeyword, setSearchKeyword, type, setType } = useSearchKeyword();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileSrc, setProfileSrc] = useState<string>(DEFAULT_PROFILE);

  const emitSearch = (query: string) => {
    setSearchKeyword(query);
  };

  useEffect(() => {
    navigate({
      pathname,
      search: searchKeyword ? `?q=${encodeURIComponent(searchKeyword)}&type=${type}` : `?type=${type}`,
    });
  }, [searchKeyword]);

  const isMyGroupActive =
    pathname.startsWith("/mygroup") || pathname.startsWith("/group/");

  useEffect(() => {
    if (!hasAccessToken()) {
      setUser(null);
      setProfileSrc(DEFAULT_PROFILE);
      return;
    }

    const cached = userStore.get();
    if (cached) {
      setUser(cached);
      return;
    }

    (async () => {
      const me = await fetchMyProfile();
      if (me) userStore.set(me);
      setUser(me);
    })();
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {

      let next = DEFAULT_PROFILE;

      if (user?.profileImageUrl) {
        next = user.profileImageUrl;
      } else if (user?.profileImage?.uuid) {
        try {
          next = await getImage(user.profileImage.uuid, user.profileImage.fileName);
        } catch {
          next = DEFAULT_PROFILE;
        }
      }

      if (alive) setProfileSrc(next);
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  return (
    <>
      <div style={{ height: navbarHeight }}></div>

      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} />
          </div>

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
              onClick={() => {
                setType("joined");
              }}
              to={`/mygroup`}
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

          <div className={styles.rightSection}>
            <SearchBar placeholder="스터디 이름을 검색해 보세요" onSearch={emitSearch} />

            {user ? (
              <img
                src={profileSrc}
                alt="프로필"
                className={styles.profileImage}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_PROFILE;
                }}
              />
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
