import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/hostGroupStudy/HostGroupStudy.module.css";
import { getStudyByStep, type StepStudy, type Attachment } from "../../apis/Group/StudyGroupStep";
import { getFile, getImage } from "../../apis/common/File";

export default function HostGroupStudy() {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId?: string; stepId?: string }>();

  const [loading, setLoading] = useState(false);
  const [study, setStudy] = useState<StepStudy | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: any }>({});

  const gid = Number(groupId);
  const step = Number(stepId);

  // ✅ 작성(또는 수정) 버튼: 라우터에 맞춰 정확히 이동
  const handleWriteClick = () => {
    if (!gid || !step) return;
    navigate(`/group/${gid}/step/${step}/MyGroupStudy/write`, {
      // 있으면 수정 폼 초기값으로 넘김(없으면 작성)
      state: { initial: study || undefined },
    });
  };

  useEffect(() => {
    if (!study?.attachedImages) return;

    const fetchImages = async () => {
      if (study?.attachedImages && study.attachedImages.length > 0) {
        const imageUrlMap: { [key: string]: string } = {};

        for (const image of study.attachedImages) {
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
  }, [study?.attachedImages]);

  const handleFileDownload = async (file: Attachment) => {
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

  useEffect(() => {
    if (!gid || !step) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getStudyByStep(gid, step);
        setStudy(data ?? null);
      } catch {
        setStudy(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [gid, step]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.div__container}>
        {loading ? (
          <div className={styles.noteBox}>
            <h2 className={styles.noteTitle}>불러오는 중...</h2>
          </div>
        ) : study ? (
          <div className={styles.noteBox}>
            <h2 className={styles.noteTitle}>{study.title}</h2>
            <div
              className={styles.noteContent}
              dangerouslySetInnerHTML={{ __html: study.content }}
            />

            {/* 첨부된 이미지들 */}
            {study.attachedImages && study.attachedImages.length > 0 && (
              <div>
                <div>
                  {study.attachedImages.map((image) => (
                    <div key={image.uuid}>
                      {imageUrls[image.uuid] && (
                        <img
                          src={imageUrls[image.uuid]}
                          className={styles.mynote__image}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 첨부된 파일들 */}
            {study.attachedFiles && study.attachedFiles.length > 0 && (
              <div>
                <p>첨부 파일</p>
                <div className={styles.mynote__fileList}>
                  {study.attachedFiles.map((file) => (
                    <div key={file.uuid} className={styles.mynote__fileItem}>
                      <button
                        onClick={() => handleFileDownload(file)}
                        className={styles.mynote__fileButton}
                      >
                        {file.fileName}
                      </button>
                      <span>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noteBox}>
            <h2 className={styles.noteTitle}>제목</h2>
            <p className={styles.noteContent}>내용</p>
          </div>
        )}
      </div>

      <div className={styles.button__container}>
        <button className={styles.button} onClick={handleWriteClick}>
          {study ? "수정" : "작성"}
        </button>
      </div>
    </div>
  );
}