import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
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
import { tokenStore, isJwtExpired } from "../../apis/common/token";
import { getImage } from "../../apis/common/File";

const DEFAULT_PROFILE = (() => {
  try {
    const base =
      (typeof import.meta !== "undefined" && (import.meta as any).env?.BASE_URL) ||
      (typeof document !== "undefined" ? document.baseURI : "/");
    return new URL("default-profile.svg", base).toString();
  } catch {
    return "/default-profile.svg";
  }
})();

export default function Navbar() {
  const navbarHeight = "116px";
  const { pathname } = useLocation();
  const { setSearchKeyword, type, setType } = useSearchKeyword();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileSrc, setProfileSrc] = useState<string>(DEFAULT_PROFILE);

  const navigate = useNavigate();

  const emitSearch = (query: string) => {
    setSearchKeyword(query);
    navigate({
      pathname,
      search: query ? `?q=${encodeURIComponent(query)}` : "",
    });
  };

  const isMyGroupActive =
    pathname.startsWith("/mygroup") || pathname.startsWith("/group/");

  const reevaluateAuth = async () => {
    const tokens = tokenStore.get();
    const access = tokens?.accessToken;
    if (!hasAccessToken() || !access || isJwtExpired(access)) {
      setUser(null);
      setProfileSrc(DEFAULT_PROFILE);
      userStore.clear?.();
      return;
    }

    const cached = userStore.get();
    if (cached) {
      setUser(cached);
    }

    try {
      const me = await fetchMyProfile();
      if (me) {
        userStore.set(me);
        setUser(me);
      } else {
        setUser(null);
        setProfileSrc(DEFAULT_PROFILE);
        userStore.clear?.();
      }
    } catch {
      setUser(null);
      setProfileSrc(DEFAULT_PROFILE);
      userStore.clear?.();
    }
  };

  useEffect(() => {
    reevaluateAuth();
  }, [pathname]);

  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setProfileSrc(DEFAULT_PROFILE);
      userStore.clear?.();
    };
    const onTokenChanged = () => reevaluateAuth();
    const onFocus = () => reevaluateAuth();
    const onVisibility = () => {
      if (document.visibilityState === "visible") reevaluateAuth();
    };

    window.addEventListener("auth:logout", onLogout);
    window.addEventListener("auth:tokenChanged", onTokenChanged);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("auth:logout", onLogout);
      window.removeEventListener("auth:tokenChanged", onTokenChanged);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // 프로필 이미지 결정
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
      <div style={{ height: navbarHeight }} />
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <img src="/logo.svg" alt="LearnIT Logo" className={styles.logo} onClick={() => navigate("/")} />
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
              onClick={() => setType("joined")}
              to={`/mygroup?type=${type}`}
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
            <SearchBar placeholder="그룹명 또는 카테고리를 검색해 보세요" onSearch={emitSearch} />
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
