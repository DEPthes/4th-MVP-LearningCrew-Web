import { useState } from "react"
import styles from "../../styles/signUp/Profile.module.css"
import ProfileIcon from "../../assets/ProfileIcon.svg"
import PhotoCamera from "../../assets/PhotoCamera.svg"

type ProfileProps = {
  onImageChange: (file: File | null) => void
}

export default function Profile({ onImageChange }: ProfileProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("*프로필 사진을 업로드 하세요.")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB 초과
        setErrorMessage("*프로필 사진이 50MB를 초과하였습니다.")
        onImageChange(null)
        setPreview(null)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        onImageChange(file)
        setErrorMessage("*프로필 사진을 업로드 하세요.") // 초기화
      }
      reader.readAsDataURL(file)
    } else {
      onImageChange(null)
      setPreview(null)
      setErrorMessage("*프로필 사진을 업로드 하세요.")
    }
  }

  const isError = errorMessage === "*프로필 사진이 50MB를 초과하였습니다."

  return (
    <div className={styles.div__container}>
      <div className={styles.label}>프로필 이미지 설정</div>
      <div className={styles.info}>*프로필 사진은 최대 50MB까지 업로드 가능합니다.</div>

      <div className={styles.profile__wrapper}>
        <label htmlFor="fileInput" className={styles.upload__area}>
          <img
            src={preview ? preview : ProfileIcon}
            alt="프로필 이미지"
            className={styles.icon}
          />
        </label>

        <label htmlFor="fileInput" className={styles.cameraImg}>
          <img src={PhotoCamera} alt="camera icon" />
        </label>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      <div className={`${styles.msg} ${isError ? styles.error : ""}`}>
        {errorMessage}
      </div>
    </div>
  )
}