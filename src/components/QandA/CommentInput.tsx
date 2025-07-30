import { useState, useRef } from "react";
import styles from "../../styles/QandA/Comment.module.css";
import Camera from "../../assets/Camera.svg";

interface CommentInputProps {
  onSubmit: (comment: { writer: string; content: string; image?: File }) => void;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  // const [writer, setWriter] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    // if (!writer.trim() || !content.trim()) return;

    onSubmit({
      writer: "soyeon",
      content: content.trim(),
      image: selectedFile || undefined
    });
    setContent(""); // 댓글 내용만 초기화 (작성자는 유지)
    setSelectedFile(null); // 선택된 파일도 초기화
  };

  return (
    <div className={styles.comment__input__container}>
      <div className={styles.comment__writer}>
        <p>닉네임 닉네임</p>
      </div>
      <div className={styles.comment__input__content}>
        <img
          src={Camera}
          onClick={handleCameraClick}
          style={{ cursor: 'pointer' }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <input
          placeholder="댓글을 남겨보세요"
          value={content}
          maxLength={50}
          onChange={(e) => setContent(e.target.value)}
          className={styles.comment__input__text}
        />
        <button
          onClick={handleSubmit}
          style={
            {
              backgroundColor: content.length > 0 && content.length < 52 ? "var(--MainColor2)" : "white",
              color: content.length > 0 && content.length < 52 ? "white" : "var(--Gray0)",
              cursor: content.length > 0 && content.length < 52 ? "pointer" : "default",
            }
          }
          className={styles.comment__input__submit}
        >
          등록
        </button>
      </div>
      {selectedFile && (
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'var(--Gray0)',
          paddingLeft: '40px'
        }}>
          선택된 파일: {selectedFile.name}
        </div>
      )}
    </div>
  );
}; 