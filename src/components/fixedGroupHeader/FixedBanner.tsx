// src/components/fixedGroupHeader/FixedBanner.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { closeStudyGroup } from "../../apis/Group/StudyGroupManage";
import { getStudyGroupDetail, type StudyGroupDetail } from "../../apis/Group/StudyGroup";
import { getStudyByStep, type StepStudy } from "../../apis/Group/StudyGroupStep";

type JoinUiState = "NONE" | ApplicationState;

interface FixedBannerProps {
  groupId: number;
  isOwner: boolean;
}

export default function FixedBanner({ groupId, isOwner }: FixedBannerProps) {
  const navigate = useNavigate();
  const { stepId: stepIdParam } = useParams<{ stepId: string }>();

  // 그룹/스텝 데이터
  const [group, setGroup] = useState<StudyGroupDetail | null>(null);
  const [stepInfo, setStepInfo] = useState<StepStudy | null>(null);

  // 북마크 & 가입 버튼
  const [bookmarked, setBookmarked] = useState(false);
  const [joinState, setJoinState] = useState<JoinUiState>("NONE");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 스텝바 표시용
  const totalSteps = group?.steps?.length ?? 10;
  const currentStepIndex =
    Math.max(0, (Number(stepIdParam) || group?.currentStep || 1) - 1);

  const fmt = (d?: string) => (d ? d.replaceAll("-", ".") : "");

  // 그룹 상세
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detail = await getStudyGroupDetail(groupId);
        if (!mounted) return;
        setGroup(detail);
        setBookmarked(Boolean(detail.dibs));
      } catch {
        setGroup(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [groupId]);

  // 현재 스텝 정보
  useEffect(() => {
    const step = Number(stepIdParam);
    if (!step || Number.isNaN(step)) {
      setStepInfo(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const data = await getStudyByStep(groupId, step);
        if (!mounted) return;
        setStepInfo(data);
      } catch {
        setStepInfo(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [groupId, stepIdParam]);

  // 내 가입 상태
  const syncMyState = async () => {
    try {
      const my = await getMyApplicationForGroup(groupId);
      setJoinState((my?.state as JoinUiState) ?? "NONE");
    } catch {
      setJoinState("NONE");
    }
  };
  useEffect(() => {
    syncMyState().catch(() => undefined);
  }, [groupId]);

  // 신청 대기 중이면 주기 갱신
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
      const msg = e?.response?.data?.message || e?.message || "요청 처리 중 오류가 발생했어요.";
      setErrorMsg(msg);
      syncMyState().catch(() => undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGroup = async () => {
    if (!confirm("정말로 이 스터디를 폐쇄할까요? 이 작업은 되돌릴 수 없어요.")) return;
    try {
      setLoading(true);
      const status = await closeStudyGroup(groupId);
      if (status === 204) alert("스터디가 폐쇄되었습니다.");
      navigate("/mygroup", { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "스터디 폐쇄에 실패했습니다.";
      alert(msg);
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
              {/* 그룹명 */}
              <div className={styles.title}>{group?.name ?? "같이 공부 해요"}</div>
              {/* 소개 문구: 현재 스텝 제목이 있으면 우선 노출 */}
              <div className={styles.introduce}>
                {stepInfo?.title ?? group?.summary ?? "스터디가 처음이신 분들 함께해요!"}
              </div>
            </div>

            <div className={styles.container__3}>
              <div className={styles.hostName}>
                {group?.owner?.nickname ? `@${group.owner.nickname}` : "@아무개"}
              </div>
            </div>

            <div className={styles.container__4}>
              <div className={styles.study__people}>스터디 정원</div>
              <div className={styles.study__people__info}>
                {(group?.memberCount ?? 0)}/{group?.maxMembers ?? 0}
              </div>
            </div>

            <div className={styles.container__5}>
              <div className={styles.study__date}>스터디 일정</div>
              <div className={styles.study__date__info}>
                {fmt(group?.startDate)}~{fmt(group?.endDate)}
              </div>
            </div>

            <div className={styles.container__6}>
              <button
                type="button"
                className={`${styles.Bookmark} ${bookmarked ? styles.BookmarkActive : ""}`}
                onClick={handleBookmarkClick}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
              >
                <img src={bookmarked ? BookmarkOn : bookmark1} alt="북마크" />
              </button>

              {!isOwner ? (
                <button
                  disabled={loading}
                  className={`${styles.button} ${isLeaveStyle ? styles.leaveButton : ""}`}
                  onClick={handleJoinClick}
                >
                  {joinButtonLabel}
                </button>
              ) : (
                <button
                  disabled={loading}
                  className={`${styles.button} ${styles.leaveButton}`}
                  onClick={handleCloseGroup}
                >
                  폐쇄
                </button>
              )}
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
        <Step totalSteps={totalSteps} currentStep={currentStepIndex} />
      </div>
    </div>
  );
}