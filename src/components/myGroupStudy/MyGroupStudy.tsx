import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/myGroupStudy/MyGroupStudy.module.css";
import { Lock } from "../common/Lock";
import { getStudyByStep, type StepStudy } from "../../apis/Group/StudyGroupStep";
import { useGroupTab } from "../../hooks/GroupTabContext";

export default function MyGroupStudy() {
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const { setCurrentTab } = useGroupTab();

  const [step, setStep] = useState<StepStudy | null>(null);
  const [stepLoading, setStepLoading] = useState<boolean>(true);

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
        </div>
      </div>
    </>
  );
}
