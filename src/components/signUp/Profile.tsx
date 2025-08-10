import { useState, useEffect } from "react";
import styles from "../../styles/signUp/Profile.module.css";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import PhotoCamera from "../../assets/PhotoCamera.svg";

type ProfileProps = {
  onImageChange: (file: File | null) => void;
  variant?: "rect" | "circle";       // 직사각 / 원형
  aspectRatio?: number;              // 비율
  labelText?: string;                // 상단 라벨
  infoText?: string;                 // 용량 안내
  helpText?: string;                 // 하단 안내 문구
  placeholderSrc?: string;           // 기본 이미지
};

export default function Profile({
  onImageChange,
  placeholderSrc = ProfileIcon,
  variant = "circle",
  aspectRatio,
  labelText = "프로필 이미지 설정",
  infoText = "*프로필 사진은 최대 50MB까지 업로드 가능합니다.",
  helpText = "*프로필 사진을 업로드 하세요.",
}: ProfileProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(helpText);

  // helpText 변경 시 동기화
  useEffect(() => {
    if (!preview && errorMessage !== "*프로필 사진이 50MB를 초과하였습니다.") {
      setErrorMessage(helpText);
    }
  }, [helpText, preview, errorMessage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB 초과
        setErrorMessage("*프로필 사진이 50MB를 초과하였습니다.");
        onImageChange(null);
        setPreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageChange(file);
        setErrorMessage(helpText); // 초기화
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null);
      setPreview(null);
      setErrorMessage(helpText);
    }
  };

  const isError = errorMessage === "*프로필 사진이 50MB를 초과하였습니다.";

  return (
    <div className={styles.div__container}>
      <div className={styles.label}>{labelText}</div>
      <div className={styles.info}>{infoText}</div>

      {/* variant/aspectRatio 적용: rect면 직사각, circle이면 기존 */}
      <div
        className={`${styles.profile__wrapper} ${
          variant === "rect" ? styles.rect : styles.circle
        }`}
        style={variant === "rect" && aspectRatio ? { aspectRatio } : undefined}
      >
        <label htmlFor="fileInput" className={styles.upload__area}>
          <img
            src={preview ? preview : placeholderSrc}
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
  );
}
