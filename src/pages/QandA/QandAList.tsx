// import { useNavigate, useParams } from "react-router-dom";
import { WriteBtn } from "../../components/QandA/WriteBtn"
import styles from "../../styles/QandA/QandAListPageStyle.module.css"
import { List } from "../../components/common/List";
import { Sort } from "../../components/common/Sort";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQandAList } from "../../apis/studygroup/QandA";
import { Lock } from "../../components/common/Lock";
import { getStudyGroup } from "../../apis/studygroup/StudyGroup";

export const QandAList = () => {
  const navigate = useNavigate();
  const [qnaSort, setQnaSort] = useState<string>("최신순");
  const [loading, setLoading] = useState(true);
  const [canAccessGroup, setCanAccessGroup] = useState<boolean>(false);
  const [canAccessStep, setCanAccessStep] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();
  const [qnaData, setQnaData] = useState<any[]>();

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
    const fetchQandAList = async () => {
      try {
        const response = await getQandAList({ groupId: groupId ?? "1", stepId: stepId ?? "1" });
        setQnaData(response.content);
        setCanAccessGroup(true);
        setLoading(false);
      } catch (error) {
        console.error("질문 목록을 가져오는데 실패했습니다:", error);
        setCanAccessGroup(false);
        setLoading(false);
      }
    };

    fetchQandAList();
  }, [currentStep, groupId, stepId]);

  const handleNoteClick = (noteId: number) => {
    navigate(`/group/${groupId}/step/${stepId}/QandADetail/${noteId}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.qanda__container}>
      {!canAccessGroup ? (
        <Lock />
      ) : (!canAccessStep ? (
        <Lock text="아직 확인할 수 없습니다" />
      ) : qnaData ? (
        <>
          <div className={styles.qanda__sort}><Sort sort={qnaSort} setSort={setQnaSort} /></div>
          <List handleClick={handleNoteClick} items={qnaData} pagenation={true} sort={qnaSort} />
          <WriteBtn />
        </>
      ) : (
        <>
          <div className={styles.qanda__sort}><Sort sort={qnaSort} setSort={setQnaSort} /></div>
          <WriteBtn />
        </>
      ))}
    </div>
  )
}