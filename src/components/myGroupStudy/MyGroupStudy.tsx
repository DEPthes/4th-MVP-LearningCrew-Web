import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/myGroupStudy/MyGroupStudy.module.css";
import { Lock } from "../common/Lock";
import { getStudyByStep, type Attachment, type StepStudy } from "../../apis/Group/StudyGroupStep";
import { useGroupTab } from "../../hooks/GroupTabContext";
import { getFile, getImage } from "../../apis/common/File";

export default function MyGroupStudy() {
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const { setCurrentTab } = useGroupTab();

  const [step, setStep] = useState<StepStudy | null>(null);
  const [stepLoading, setStepLoading] = useState<boolean>(true);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: any }>({});
  // 컴포넌트 마운트 시 MyGroupStudy 탭으로 설정
  useEffect(() => {
    setCurrentTab('MyGroupStudy');
  }, [setCurrentTab]);

  // step 정보 가져오기
  useEffect(() => {
    if (!groupId || !stepId) return;

    const stepNum = Number(stepId);
    if (!Number.isFinite(stepNum) || stepNum <= 0) return;

    (async () => {
      try {
        setStepLoading(true);
        const stepData = await getStudyByStep(Number(groupId), stepNum);
        setStep(stepData);
        setStepLoading(false);
      } catch (e: unknown) {
        console.error("스텝 정보를 불러오지 못했습니다:", e);
        setStepLoading(false);
        setStep(null);
      } finally {
        setStepLoading(false);
      }
    })();
  }, [groupId, stepId]);

  useEffect(() => {
    if (!step?.attachedImages) return;

    const fetchImages = async () => {
      if (step?.attachedImages && step.attachedImages.length > 0) {
        const imageUrlMap: { [key: string]: string } = {};

        for (const image of step.attachedImages) {
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
  }, [step?.attachedImages]);

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

  if (stepLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noteBox}>
          <h2 className={styles.noteTitle}>불러오는 중...</h2>
          <p className={styles.noteContent}>잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <>
        <Lock />
      </>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.noteBox}>
          <h2 className={styles.noteTitle}>{step?.title}</h2>
          <div className={styles.noteContent} dangerouslySetInnerHTML={{ __html: step?.content ?? "" }} />
          {/* 첨부된 이미지들 */}
          {step.attachedImages && step.attachedImages.length > 0 && (
            <div>
              <div>
                {step.attachedImages.map((image) => (
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
          {step.attachedFiles && step.attachedFiles.length > 0 && (
            <div>
              <p>첨부 파일</p>
              <div className={styles.mynote__fileList}>
                {step.attachedFiles.map((file) => (
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
      </div>
    </>
  );
}
