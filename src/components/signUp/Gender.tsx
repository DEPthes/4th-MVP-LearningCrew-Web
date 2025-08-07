import styles from "../../styles/signUp/Gender.module.css"

type GenderProps = {
  selected: string | null
  onSelect: (gender: string) => void
}

export default function Gender({ selected, onSelect }: GenderProps) {
  return (
    <div className={styles.div__container}>
      <div className={styles.label}>성별</div>
      <div className={styles.info}>*성별을 선택하세요.</div>
      <div className={styles.button__container}>
        {["MALE", "FEMALE", "OTHER"].map((gender) => (
          <button
            key={gender}
            type="button"
            className={`${styles.button} ${selected === gender ? styles.active : ""}`}
            onClick={() => onSelect(gender)}
          >
            {gender === "MALE" ? "남자" : gender === "FEMALE" ? "여자" : "기타"}
          </button>
        ))}
      </div>
    </div>
  )
}