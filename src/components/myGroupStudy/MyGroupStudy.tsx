import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "../../styles/myGroupStudy/MyGroupStudy.module.css";
import { Lock } from "../common/Lock";
import {
  fetchStudyGroup,
  type StudyGroupDetail,
} from "../../apis/common/studyGroups";
import { useGroupTab } from "../../hooks/GroupTabContext";

type LocationState = {
  group?: StudyGroupDetail;
};

export default function MyGroupStudy() {
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const location = useLocation();
  const passed = (location.state as LocationState | null)?.group ?? null;
  const { setCurrentTab } = useGroupTab();

  const [group, setGroup] = useState<StudyGroupDetail | null>(passed);
  const [loading, setLoading] = useState<boolean>(!passed);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 MyGroupStudy 탭으로 설정
  useEffect(() => {
    setCurrentTab('MyGroupStudy');
  }, [setCurrentTab]);

  useEffect(() => {
    if (!groupId || passed) return;
    (async () => {
      try {
        setLoading(true);
        const detail = await fetchStudyGroup(Number(groupId));
        setGroup(detail);
        setError(null);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "스터디 상세를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId, passed]);

  const stepNum = Number(stepId);
  const step = useMemo(() => {
    if (!group) return null;
    const target = Number.isFinite(stepNum) && stepNum > 0 ? stepNum : group.currentStep;
    return group.steps?.find((s) => s.step === target) ?? null;
  }, [group, stepNum]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noteBox}>
          <h2 className={styles.noteTitle}>불러오는 중...</h2>
          <p className={styles.noteContent}>잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <>
        <Lock />
      </>
    );
  }

  const title = step?.title ?? group.name;
  const content =
    step?.content ?? group.summary ?? "이 스텝에 대한 내용이 없습니다.";

  return (
    <>
      {error || !group ? (
        <Lock text="아직 확인할 수 없습니다" />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.noteBox}>
            <h2 className={styles.noteTitle}>{title}</h2>
            <div className={styles.noteContent} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </>
  );
}
