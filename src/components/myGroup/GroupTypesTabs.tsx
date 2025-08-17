import styles from "../../styles/myGroup/GroupTypeTabs.module.css";
import { useSearchKeyword } from "../../hooks/SearchKeywordContext";
import { useNavigate } from "react-router-dom";

export type GroupType = "joined" | "hosted" | "applied";

type Props = {
  value: GroupType;
  // onChange: (next: GroupType) => void;
};

const items: { key: GroupType; label: string }[] = [
  { key: "joined", label: "참여 그룹" },
  { key: "hosted", label: "주최 그룹" },
  { key: "applied", label: "가입 신청 그룹" },
];

export default function GroupTypeTabs({ value }: Props) {
  const { setType } = useSearchKeyword();
  const navigate = useNavigate();
  return (
    <div className={styles.tabs}>
      {items.map(({ key, label }) => {
        const active = value === key;
        return (
          <div
            key={key}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            onClick={() => {
              // onChange(key);
              setType(key);
              navigate(`/mygroup?type=${key}`);
            }}
          >
            <span className={styles.dot} />
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}