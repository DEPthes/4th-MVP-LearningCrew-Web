import styles from "../../styles/signUp/IdInputGroup.module.css"

type IdInputGroupProps = {
  label: string
  placeholder: string
  message: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCheckDuplicate?: () => void
  showCheckButton?: boolean
  isValid?: boolean
}

export default function IdInputGroup({
  label,
  placeholder,
  message,
  type,
  value,
  onChange,
  onCheckDuplicate,
  showCheckButton = false,
  isValid = false,
}: IdInputGroupProps) {
  const isHighlighted =
    message === "*사용 가능한 아이디입니다." ||
    message === "*중복되는 아이디입니다." ||
    message === "*사용 가능한 닉네임입니다." ||
    message === "*중복되는 닉네임입니다."

  return (
    <div className={styles.div__container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.input__container}>
        <input
          type={type}
          placeholder={placeholder}
          className={styles.input}
          value={value}
          onChange={onChange}
        />
        {showCheckButton && (
          <button
            type="button"
            className={`${styles.dup__button} ${isValid ? styles.active : ""}`}
            onClick={onCheckDuplicate}
          >
            중복 확인
          </button>
        )}
      </div>
      <div className={`${styles.input__require} ${isHighlighted ? styles.success : ""}`}>
        {message}
      </div>
    </div>
  )
}