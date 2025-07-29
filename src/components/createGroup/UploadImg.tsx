import styles from "../../styles/createGroup/UploadImgComponentStyle.module.css";
import Camera from "../../assets/CameraImg.svg";
import { useState, useRef } from "react";
import type { UseFormSetValue } from "react-hook-form";

interface UploadProps {
  name?: string;
  message: string;
  errorMessage?: string;
  message2: string;
  errorMessage2?: string;
  setValue?: UseFormSetValue<any>;
}

export const UploadImg = ({ name, message, errorMessage, message2, errorMessage2, setValue }: UploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      if (name && setValue) setValue(name, file, { shouldValidate: true });
    }
  };

  const handleCameraClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); // div 클릭 전파 방지
    fileInputRef.current?.click();
  };

  return (
    <>
      {errorMessage ? <p className={styles.upload__errormessage}>*{errorMessage}</p> : <p className={styles.upload__message}>*{message}</p>}
      <div
        className={styles.upload__image}
        style={{
          backgroundImage: `url(${image || Camera})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={Camera}
          alt="upload"
          className={styles.camera__icon}
          onClick={handleCameraClick}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>
      {errorMessage2 ? <p className={styles.upload__errormessage2}>*{errorMessage2}</p> : <p className={styles.upload__message2}>*{message2}</p>}
    </>
  );
};
