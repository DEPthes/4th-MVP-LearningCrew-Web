import styles from "../../styles/home/CategoryTabs.module.css";

const categories = [
  { key: "all", label: "전체" },
  { key: "lang", label: "언어" },
  { key: "art", label: "디자인, 아트" },
  { key: "biz", label: "경영, 마케팅" },
  { key: "dev", label: "개발, 프로그래밍" },
  { key: "game", label: "게임 개발" },
  { key: "sec", label: "보안, 네트워크" },
  { key: "job", label: "커리어" },
  { key: "hardware", label: "하드웨어" },
  { key: "exam", label: "대입 수능" },
];

type Props = {
  selectedLabel: string;               
  onSelect: (label: string) => void;
};

export default function CategoryTabs({ selectedLabel, onSelect }: Props) {
  return (
    <div className={styles.tabContainer}>
      {categories.map((cat) => {
        const isActive = selectedLabel === cat.label;
        const iconSrc = `/icons/${cat.key}-${isActive ? "on" : "off"}.svg`;
        return (
          <div
            key={cat.key}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect(cat.label)}
          >
            <img src={iconSrc} alt={cat.label} className={styles.icon} />
            <span className={styles.label}>{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
