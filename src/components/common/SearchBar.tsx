import { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import styles from "../../styles/common/Navbar.module.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ placeholder = "그룹명 또는 카테고리를 검색해 보세요", onSearch }: SearchBarProps) {
  const [q, setQ] = useState("");

  const handleSearch = () => {
    const query = q.trim();
    onSearch(query);
    requestAnimationFrame(() => {
      setQ("");
    });
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <MdOutlineSearch className={styles.searchIcon} onClick={handleSearch} />
    </div>
  );
}
