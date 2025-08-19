
import styles from "../../styles/common/PostDetail.module.css";
import { useState, useEffect } from "react";
import { getImage, getFile } from "../../apis/common/File";

interface AttachedFile {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
}

interface AttachedImage {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
}

interface CreatedBy {
  id: number;
  email: string;
  nickname: string;
  role: string;
  gender: string;
  profileImage: any;
  createdAt: string;
  lastModifiedAt: string;
}

interface NoteData {
  id: number;
  step: number;
  title: string;
  content: string;
  attachedFiles: AttachedFile[];
  attachedImages: AttachedImage[];
  createdBy: CreatedBy;
  lastModifiedBy: CreatedBy;
  createdAt: string;
  lastModifiedAt: string;
}

interface PostDetailProps {
  data?: NoteData;
}

export const PostDetail = ({ data }: PostDetailProps) => {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      if (data?.attachedImages && data.attachedImages.length > 0) {
        const imageUrlMap: { [key: string]: string } = {};

        for (const image of data.attachedImages) {
          try {
            const response = await getImage(image.uuid);
            imageUrlMap[image.uuid] = response || "";
          } catch (error) {
            console.error(`이미지 로드 실패: ${image.fileName}`, error);
          }
        }

        setImageUrls(imageUrlMap);
      }
    };

    fetchImages();
  }, [data?.attachedImages]);

  const handleFileDownload = async (file: AttachedFile) => {
    try {
      const response = await getFile(file.uuid);

      const link = document.createElement("a");
      link.href = response;
      link.download = file.fileName; // 저장될 파일 이름
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 정리
      window.URL.revokeObjectURL(response);
    } catch (error) {
      console.error(`파일 다운로드 실패: ${file.fileName}`, error);
    }
  };

  if (!data?.id) {
    return <div className={styles.detail__container}>노트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.detail__container}>
      <div className={styles.detail__header}>
        <h1 className={styles.detail__title}>{data.title}</h1>
        <div className={styles.detail__info}>
          <span className={styles.detail__writer}>{data.createdBy.nickname}</span>
          <span className={styles.detail__date}>{new Date(data.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>
      </div>

      <div
        className={styles.detail__content}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      {/* 첨부된 이미지들 */}
      {data.attachedImages && data.attachedImages.length > 0 && (
        <div>
          <div>
            {data.attachedImages.map((image) => (
              <div key={image.uuid}>
                {imageUrls[image.uuid] && (
                  <img
                    src={imageUrls[image.uuid]}
                    alt={image.fileName}
                    className={styles.detail__image}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 첨부된 파일들 */}
      {data.attachedFiles && data.attachedFiles.length > 0 && (
        <div>
          <p>첨부 파일</p>
          <div className={styles.detail__fileList}>
            {data.attachedFiles.map((file) => (
              <div key={file.uuid} className={styles.detail__fileItem}>
                <button
                  onClick={() => handleFileDownload(file)}
                  className={styles.detail__fileButton}
                >
                  {file.fileName}
                </button>
                <span className={styles.detail__fileSize}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};