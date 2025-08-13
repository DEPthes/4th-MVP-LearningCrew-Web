import styles from "../../styles/signUp/PasswordInputGroup.module.css"

interface PasswordInputGroupProps {
  label: string
  placeholder: string
  message: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordInputGroup({
  label,
  placeholder,
  message,
  value,
  onChange,
}: PasswordInputGroupProps) {
  const isError = message.includes("충족하지") || message.includes("일치하지")
  const isSuccess =
    message === "*사용 가능한 비밀번호입니다." ||
    message === "*비밀번호가 일치합니다."

  return (
    <div className={styles.div__container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.input__container}>
        <input
          type="password"
          placeholder={placeholder}
          className={styles.input}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          inputMode="text"
        />
      </div>
      <div
        className={`${styles.input__require} ${
          isError ? styles.require__error : ""
        } ${isSuccess ? styles.success : ""}`}
      >
        {message}
      </div>
    </div>
  )
}