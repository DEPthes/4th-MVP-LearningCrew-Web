import { useEffect, useState } from "react";
import { getMyNote } from "../../apis/studygroup/Note";
import { Submit } from "../../components/common/Submit";
import styles from "../../styles/myNote/MyNotePageStyle.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "../../components/common/Lock";
import { getStudyGroup } from "../../apis/studygroup/StudyGroup";
import { getImage, getFile } from "../../apis/common/File";
import { getQandAList } from "../../apis/studygroup/QandA";
import { useGroupTab } from "../../hooks/GroupTabContext";

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
  profileImage: string | null;
  createdAt: string;
  lastModifiedAt: string;
}

interface MyNoteData {
  id: number;
  step: number;
  title: string;
  content: string;
  attachedFiles?: AttachedFile[];
  attachedImages?: AttachedImage[];
  createdBy: CreatedBy;
  lastModifiedBy: CreatedBy;
  createdAt: string;
  lastModifiedAt: string;
}

export const MyNote = () => {
  const navigator = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();
  const { setCurrentTab, currentTab } = useGroupTab();
  const [myNote, setMyNote] = useState<MyNoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canAccessGroup, setCanAccessGroup] = useState<boolean>(false);
  const [canAccessStep, setCanAccessStep] = useState<boolean>(false);
  const [isCurrentStep, setIsCurrentStep] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: any }>({});
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 컴포넌트 마운트 시 내 노트 탭으로 설정
  useEffect(() => {
    setCurrentTab('myNote');
  }, [setCurrentTab]);

  //나중에 없애기 전역관리로....
  useEffect(() => {
    const fetchStudyGroup = async () => {
      try {
        const response = await getStudyGroup(groupId ?? "1");
        const groupCurrentStep = response.currentStep;
        setCurrentStep(groupCurrentStep);
        setIsCurrentStep(groupCurrentStep === parseInt(stepId ?? "0"));
      } catch (error) {
        console.error("스터디 그룹을 가져오는데 실패했습니다:", error);
        setLoading(false);
        setCanAccessStep(false);
      }
    };
    fetchStudyGroup();
  }, [groupId, stepId]);

  // currentStep이 업데이트된 후 접근 권한 확인 및 노트 가져오기
  useEffect(() => {
    if (currentStep === 0) return;

    if (currentStep < parseInt(stepId ?? "0")) {
      setCanAccessStep(false);
      setLoading(false);

      //나중에 전역관리로 바꾸기
      const fetchList = async () => {
        try {
          await getQandAList({ groupId: groupId ?? "1", stepId: stepId ?? "1" });
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };
      fetchList();
    } else {
      setCanAccessStep(true);
    }
    const fetchMyNote = async () => {
      try {
        const response = await getMyNote({ groupId: groupId ?? "1", stepId: stepId ?? "2" });
        setMyNote(response);
        setCanAccessGroup(true);
        setLoading(false);
      } catch (error: any) {
        console.error("내 노트를 가져오는데 실패했습니다:", error);
        setLoading(false);

        if (error?.response?.data?.codeName !== "STUDY_GROUP_NOT_MEMBER") {
          setCanAccessGroup(true);
        }
      }
    }
    fetchMyNote();

  }, [currentStep, stepId, groupId, currentTab]);

  // 이미지 로드
  useEffect(() => {
    if (!myNote?.attachedImages) return;

    const fetchImages = async () => {
      if (myNote?.attachedImages && myNote.attachedImages.length > 0) {
        const imageUrlMap: { [key: string]: string } = {};

        for (const image of myNote.attachedImages) {
          try {
            const response = await getImage(image.uuid);
            imageUrlMap[image.uuid] = response;
          } catch (error) {
            console.error(`이미지 로드 실패: ${image.fileName}`, error);
          }
        }
        setImageUrls(imageUrlMap);
      }
    };

    fetchImages();
  }, [myNote?.attachedImages]);

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const handleWriteClick = () => {
    navigator(`/group/${groupId}/step/${stepId}/myNote/write`);
  }

  return (
    <div className={styles.mynote__container}>
      {!canAccessGroup ? (
        <Lock />
      ) : (!canAccessStep ? (
        <Lock text="아직 확인할 수 없습니다" />
      ) : myNote ? (
        <>
          <div className={styles.mynote__content__container}>
            <div className={styles.mynote__title}>{myNote.title}</div>

            {/* 첨부된 이미지들 */}
            {myNote.attachedImages && myNote.attachedImages.length > 0 && (
              <div>
                <div>
                  {myNote.attachedImages.map((image) => (
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

            <div className={styles.mynote__content}>
              <div dangerouslySetInnerHTML={{ __html: myNote.content }} />
            </div>

            {/* 첨부된 파일들 */}
            {myNote.attachedFiles && myNote.attachedFiles.length > 0 && (
              <div>
                <p>첨부 파일</p>
                <div className={styles.mynote__fileList}>
                  {myNote.attachedFiles.map((file) => (
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
        </>
      ) : (
        <>
          <div className={styles.mynote__none__container}>
            <div className={styles.mynote__none1}>아직 작성된 노트가 없습니다</div>
            <div className={styles.mynote__none2}>노트를 작성해보세요</div>
          </div>
          <div className={styles.mynote__submit__container}>
            {isCurrentStep && <Submit text="작성" onClick={handleWriteClick} canSubmit={true} />}
          </div>
        </>
      ))}
    </div>
  )
};