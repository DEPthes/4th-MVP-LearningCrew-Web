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
  /** ✅ 외부에서 에러 여부만 내려받음. 클래스 문자열은 넘기지 않음 */
  error?: boolean
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
  error = false,
}: IdInputGroupProps) {
  const isHighlighted =
    message === "*사용 가능한 아이디입니다." ||
    message === "*중복되는 아이디입니다." ||
    message === "*사용 가능한 닉네임입니다." ||
    message === "*중복되는 닉네임입니다." ||
    message === "*닉네임 조건에 충족하지 않습니다." ||
    message === "*현재 본인이 사용중인 이메일입니다." ||
    message === "*현재 본인이 사용중인 닉네임입니다." 
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

      {/* ✅ error가 true면 require__error(자기 모듈) 강제 적용 */}
      <div
        className={`${styles.input__require} ${
          error ? styles.require__error : isHighlighted ? styles.success : ""
        }`}
      >
        {message}
      </div>
    </div>
  )
}