import { useState, useEffect } from "react";
import styles from "../../styles/signUp/Profile.module.css";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import PhotoCamera from "../../assets/PhotoCamera.svg";

type ProfileProps = {
  onImageChange: (file: File | null) => void;
  variant?: "rect" | "circle";
  aspectRatio?: number;
  labelText?: string;
  infoText?: string;
  helpText?: string;
  placeholderSrc?: string;
  initialImage?: string | null;
};

export default function Profile({
  onImageChange,
  placeholderSrc = ProfileIcon,
  variant = "circle",
  aspectRatio,
  labelText = "프로필 이미지 설정",
  infoText = "*프로필 사진은 최대 50MB까지 업로드 가능합니다.",
  helpText = "*프로필 사진을 업로드 하세요.",
  initialImage = null,
}: ProfileProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [errorMessage, setErrorMessage] = useState<string>(helpText);
  const [hasLocalSelection, setHasLocalSelection] = useState(false); 
  
  // initialImage가 바뀌면(내 정보 로딩 완료 등) 사용자가 새 파일을 고르지 않았을 때만 반영
  useEffect(() => {
    if (!hasLocalSelection) {
      setPreview(initialImage || null);
    }
  }, [initialImage, hasLocalSelection]);

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
        setErrorMessage("*프로필 사진이 50MB를 초과하였습니다.");
        onImageChange(null);
        setPreview(null);
        setHasLocalSelection(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageChange(file);
        setErrorMessage(helpText);
        setHasLocalSelection(true);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null);
      setPreview(initialImage || null); 
      setErrorMessage(helpText);
      setHasLocalSelection(false);
    }
  };

  const isError = errorMessage === "*프로필 사진이 50MB를 초과하였습니다.";

  return (
    <div className={styles.div__container}>
      <div className={styles.label}>{labelText}</div>
      <div className={styles.info}>{infoText}</div>

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
