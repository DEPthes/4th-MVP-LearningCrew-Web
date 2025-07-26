import { useState } from "react"
import styles from "../../../styles/signUp/Profile.module.css"
import ProfileIcon from "../../../assets/ProfileIcon.svg"

export default function Profile() {
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.div__container}>
      <div className={styles.label}>프로필 이미지 설정</div>
      <div className={styles.info}>*프로필 사진은 최대 50mb까지 업로드 가능합니다.</div>

      <label htmlFor="fileInput" className={styles.upload__area}>
        {preview ? (
          <img src={preview} alt="preview" className={styles.preview} />
        ) : (
          <>
            <img src={ProfileIcon} alt="기본 아이콘" className={styles.icon} />
          </>
        )}
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <div className={styles.msg}>*프로필 사진을 업로드 하세요.</div>
    </div>
  )
}