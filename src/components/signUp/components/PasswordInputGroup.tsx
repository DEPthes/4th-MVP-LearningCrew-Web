import styles from "../../../styles/signUp/PasswordInputGroup.module.css"

type PasswordInputGroupProps = {
  label: string
  placeholder: string
  message: string
  message2?: string
}

export default function PasswordInputGroup({
  label,
  placeholder,
  message,
  message2
}: PasswordInputGroupProps) {
  return (
    <>
      <div className={styles.div__container}>
        <label className={styles.label}>{label}</label>
        <div className={styles.input__container}>
          <input
            type="password"
            placeholder={placeholder}
            className={styles.input}
          />
          <button className={styles.toggle__btn}></button>
        </div>
        <div className={styles.input__require}>{message}</div>
        <div className={styles.input__require2}>{message2}</div>
      </div>
    </>
  )
}