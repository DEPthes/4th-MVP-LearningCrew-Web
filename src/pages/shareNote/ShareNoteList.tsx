import { useNavigate, useParams } from "react-router-dom"
import { Sort } from "../../components/common/Sort"
import styles from "../../styles/shareNote/ShareNoteListPageStyle.module.css"
import { List } from "../../components/common/List"
import { useState, useEffect } from "react"
import { getSharedNoteList } from "../../apis/studygroup/Note"
import { Lock } from "../../components/common/Lock"
import { getStudyGroup } from "../../apis/studygroup/StudyGroup"

export const ShareNoteList = () => {
  const navigate = useNavigate()
  const [noteData, setNoteData] = useState<any[]>()
  const [snSort, setSnSort] = useState<string>("최신순")
  const [loading, setLoading] = useState(true)
  const [canAccessGroup, setCanAccessGroup] = useState<boolean>(false);
  const [canAccessStep, setCanAccessStep] = useState<boolean>(false);
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  //나중에 없애기 전역관리로....
  useEffect(() => {
    const fetchStudyGroup = async () => {
      try {
        const response = await getStudyGroup(groupId ?? "1");
        const groupCurrentStep = response.currentStep;
        setCurrentStep(groupCurrentStep);
      } catch (error) {
        console.error("스터디 그룹을 가져오는데 실패했습니다:", error);
        setLoading(false);
        setCanAccessStep(false);
      }
    };
    fetchStudyGroup();
  }, [groupId, stepId]);

  useEffect(() => {
    if (currentStep === 0) return;

    if (currentStep < parseInt(stepId ?? "0")) {
      setCanAccessStep(false);
      setLoading(false);
    } else {
      setCanAccessStep(true);
    }
    const fetchNoteList = async () => {
      try {
        const response = await getSharedNoteList({ groupId: groupId ?? "1", stepId: stepId ?? "1" });
        setNoteData(response);
        setCanAccessGroup(true);
        setLoading(false);
      } catch (error) {
        console.error("노트 목록을 가져오는데 실패했습니다:", error);
        setCanAccessGroup(false);
        setLoading(false);
      }
    };
    fetchNoteList();
  }, [currentStep, groupId, stepId]);

  const handleNoteClick = (noteId: number) => {
    navigate(`/group/${groupId}/step/${stepId}/shareNoteDetail/${noteId}`)
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.note__container}>
      {!canAccessGroup ? (
        <Lock />
      ) : (!canAccessStep ? (
        <Lock text="아직 확인할 수 없습니다" />
      ) : noteData ? (
        <>
          <div className={styles.note__sort}><Sort sort={snSort} setSort={setSnSort} /></div>
          <List handleClick={handleNoteClick} items={noteData} pagenation={false} sort={snSort} />
        </>
      ) : (
        <>
          <div className={styles.note__sort}><Sort sort={snSort} setSort={setSnSort} /></div>
        </>
      ))}
    </div>
  )
}