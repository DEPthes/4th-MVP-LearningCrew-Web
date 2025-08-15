// src/components/fixedGroupHeader/FixedBanner.tsx
import { useEffect, useMemo, useState } from "react";
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

  // 최초 진입 시 내 신청 상태 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErrorMsg("");
        const my = await getMyApplicationForGroup(groupId);
        if (!mounted) return;
        setJoinState((my?.state as JoinUiState) ?? "NONE");
      } catch {
        if (mounted) {
          setJoinState("NONE");
          setErrorMsg("");
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [groupId]);

  // 대기중(PENDING)일 땐 주기적으로 상태 재확인(선택)
  useEffect(() => {
    if (joinState !== "PENDING") return;
    const id = setInterval(async () => {
      try {
        const my = await getMyApplicationForGroup(groupId);
        setJoinState((my?.state as JoinUiState) ?? "NONE");
      } catch {
        /* ignore */
      }
    }, 10000);
    return () => clearInterval(id);
  }, [joinState, groupId]);

  // 버튼 라벨
  const joinButtonLabel = useMemo(() => {
    if (loading) return "처리 중...";
    switch (joinState) {
      case "NONE":
      case "REJECTED":
        return "가입 신청";
      case "PENDING":
        return "가입 취소"; // ✅ 신청 중이면 취소
      case "APPROVED":
        return "탈퇴";
      default:
        return "가입 신청";
    }
  }, [joinState, loading]);

  const isLeaveStyle = joinState === "PENDING" || joinState === "APPROVED";

  const handleBookmarkClick = () => setBookmarked((p) => !p);

  // ✅ 핵심: 상태별로 신청/취소/탈퇴 동작
  const handleJoinClick = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1) 아직 신청 안 했거나 거절된 상태 → '가입 신청'
      if (joinState === "NONE" || joinState === "REJECTED") {
        await applyToStudyGroup(groupId);
        setJoinState("PENDING"); // 낙관적 업데이트
        return;
      }

      // 2) 신청 대기(PENDING) → '가입 취소'
      if (joinState === "PENDING") {
        await cancelMyApplication(groupId);
        setJoinState("NONE"); // 신청 취소 후 초기 상태
        return;
      }

      // 3) 승인됨(APPROVED) → '탈퇴'
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
      // 실패 시 서버 상태 재조회로 동기화
      try {
        const my = await getMyApplicationForGroup(groupId);
        setJoinState((my?.state as JoinUiState) ?? "NONE");
      } catch {/* ignore */}
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
                    className={`${styles.Bookmark} ${bookmarked ? styles.active : ""}`}
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
      <div className={styles.step__wrapper}>
        <Step totalSteps={6} currentStep={2} />
      </div>
    </div>
  );
}