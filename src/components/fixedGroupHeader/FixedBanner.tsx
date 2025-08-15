// src/components/fixedGroupHeader/FixedBanner.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/FixedBanner.module.css";
import bookmark1 from "../../assets/bookmark1.svg";
import BookmarkOn from "../../assets/BookmarkOn.svg";
import Step from "./Step";

import {
  applyToStudyGroup,
  cancelMyApplication,
  getMyApplicationForGroup,
  leaveStudyGroup,
} from "../../apis/Group/StudyGroupApplication";
import type { ApplicationState } from "../../apis/Group/StudyGroupApplication";

type JoinUiState = "NONE" | ApplicationState;

interface FixedBannerProps {
  groupId: number;
  hostNickname?: string;
  memberCount?: number;
  maxMembers?: number;
  startDate?: string;
  endDate?: string;
}

export default function FixedBanner({
  groupId,
  hostNickname = "@아무개",
  memberCount = 14,
  maxMembers = 16,
  startDate = "25.07.11",
  endDate = "25.08.20",
}: FixedBannerProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [joinState, setJoinState] = useState<JoinUiState>("NONE");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // URL의 stepId(1-based)를 읽어서 0-based로 변환
  const { stepId: stepIdParam } = useParams<{ stepId: string }>();
  const currentStepIndex = Math.max(0, (Number(stepIdParam) || 1) - 1);

  const syncMyState = async () => {
    try {
      const my = await getMyApplicationForGroup(groupId);
      setJoinState((my?.state as JoinUiState) ?? "NONE");
    } catch {
      setJoinState("NONE");
    }
  };

  // 최초 진입 시 내 상태 조회
  useEffect(() => {
    let mounted = true;
    (async () => {
      await syncMyState();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // 대기중이면 10초마다 새로고침
  useEffect(() => {
    if (joinState !== "PENDING") return;
    const id = setInterval(() => {
      syncMyState().catch(() => undefined);
    }, 10000);
    return () => clearInterval(id);
  }, [joinState]);

  const joinButtonLabel = useMemo(() => {
    if (loading) return "처리 중...";
    switch (joinState) {
      case "NONE":
      case "REJECTED":
        return "가입 신청";
      case "PENDING":
        return "가입 취소";
      case "APPROVED":
        return "탈퇴";
      default:
        return "가입 신청";
    }
  }, [joinState, loading]);

  const isLeaveStyle = joinState === "PENDING" || joinState === "APPROVED";
  const handleBookmarkClick = () => setBookmarked((v) => !v);

  const handleJoinClick = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      if (joinState === "NONE" || joinState === "REJECTED") {
        await applyToStudyGroup(groupId);
        setJoinState("PENDING");
        return;
      }

      if (joinState === "PENDING") {
        await cancelMyApplication(groupId);
        setJoinState("NONE");
        return;
      }

      if (joinState === "APPROVED") {
        await leaveStudyGroup(groupId);
        setJoinState("NONE");
        return;
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "요청 처리 중 오류가 발생했어요.";
      setErrorMsg(msg);
      try {
        const my = await getMyApplicationForGroup(groupId);
        setJoinState((my?.state as any) ?? "NONE");
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page__page__wrapper}>
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.container__1}>
            <div className={styles.container__2}>
              <div className={styles.title}>같이 공부 해요</div>
              <div className={styles.introduce}>스터디가 처음이신 분들 함께해요!</div>
            </div>
            <div className={styles.container__3}>
              <div className={styles.hostName}>{hostNickname}</div>
            </div>
            <div className={styles.container__4}>
              <div className={styles.study__people}>스터디 정원</div>
              <div className={styles.study__people__info}>
                {memberCount}/{maxMembers}
              </div>
            </div>
            <div className={styles.container__5}>
              <div className={styles.study__date}>스터디 일정</div>
              <div className={styles.study__date__info}>
                {startDate}~{endDate}
              </div>
            </div>
            <div className={styles.container__6}>
              <button
                type="button"
                className={styles.Bookmark}
                onClick={handleBookmarkClick}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
              >
                <img src={bookmarked ? BookmarkOn : bookmark1} alt="북마크" />
              </button>
              <button
                disabled={loading}
                className={`${styles.button} ${isLeaveStyle ? styles.leaveButton : ""}`}
                onClick={handleJoinClick}
              >
                {joinButtonLabel}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className={styles.error} role="alert" aria-live="assertive">
              {errorMsg}
            </div>
          )}

          <div className={styles.category__container}>
            <div className={styles.categories}># IT</div>
            <div className={styles.categories}># 안드로이드</div>
            <div className={styles.categories}># 프론트</div>
          </div>
        </div>
      </div>

      {/* ✅ URL의 stepId(1-based)를 0-based로 변환하여 전달 */}
      <div className={styles.step__wrapper}>
        <Step totalSteps={10} currentStep={currentStepIndex} />
      </div>
    </div>
  );
}