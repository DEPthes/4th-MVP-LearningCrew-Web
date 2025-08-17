import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/hostGroupStudy/HostGroupStudy.module.css";
import { getStudyByStep, type StepStudy } from "../../apis/Group/StudyGroupStep";

export default function HostGroupStudy() {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId?: string; stepId?: string }>();

  const [loading, setLoading] = useState(false);
  const [study, setStudy] = useState<StepStudy | null>(null);

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