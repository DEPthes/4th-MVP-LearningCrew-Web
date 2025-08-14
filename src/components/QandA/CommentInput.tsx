import { useState, useRef, useEffect } from "react";
import styles from "../../styles/QandA/Comment.module.css";
import Camera from "../../assets/Camera.svg";
import { getMyInfo } from "../../apis/studygroup/QandA";

interface CommentInputProps {
  onSubmit: (comment: { content: string; attachedImages?: File[]; attachedFiles?: File[] }) => void;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [content, setContent] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  //component로 빼기
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles: File[] = [];
      const nonImageFiles: File[] = [];

      // 파일 타입에 따라 분리
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          imageFiles.push(file);
        } else {
          nonImageFiles.push(file);
        }
      });

      // 상태 업데이트
      if (imageFiles.length > 0) {
        setSelectedImages(prev => [...prev, ...imageFiles]);
      }
      if (nonImageFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...nonImageFiles]);
      }
    }
  };

  //임시
  useEffect(() => {
    const fetchMyInfo = async () => {
      const response = await getMyInfo();
      setNickname(response.nickname);
    };
    fetchMyInfo();
  }, []);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      attachedImages: selectedImages.length > 0 ? selectedImages : undefined,
      attachedFiles: selectedFiles.length > 0 ? selectedFiles : undefined
    });

    setContent("");
    setSelectedImages([]);
    setSelectedFiles([]);
  };

  return (
    <div className={styles.comment__input__container}>
      <div className={styles.comment__writer}>
        <p>{nickname}</p>
      </div>
      <div className={styles.comment__input__content}>
        <img
          src={Camera}
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
          title="파일 추가 (이미지 및 일반 파일)"
        />

        <input
          type="file"
          ref={imageInputRef}
          multiple
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
          style={{
            backgroundColor: content.length > 0 && content.length < 52 ? "var(--MainColor2)" : "white",
            color: content.length > 0 && content.length < 52 ? "white" : "var(--Gray0)",
            cursor: content.length > 0 && content.length < 52 ? "pointer" : "default",
          }}
          className={styles.comment__input__submit}
        >
          등록
        </button>
      </div>

      {/* 선택된 이미지들 */}
      {selectedImages.length > 0 && (
        <div style={{
          marginTop: '8px',
          paddingLeft: '40px'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--Gray0)', marginBottom: '4px' }}>선택된 이미지:</p>
          {selectedImages.map((image, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--Gray0)' }}>
                {image.name}
              </span>
              <button
                onClick={() => removeImage(index)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 선택된 파일들 */}
      {selectedFiles.length > 0 && (
        <div style={{
          marginTop: '8px',
          paddingLeft: '40px'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--Gray0)', marginBottom: '4px' }}>선택된 파일:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--Gray0)' }}>
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 