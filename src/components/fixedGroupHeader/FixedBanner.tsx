// src/components/fixedGroupHeader/FixedBanner.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/FixedBanner.module.css";
import bookmark1 from "../../assets/bookmark1.svg";
import BookmarkOn from "../../assets/BookmarkOn.svg";
import Step from "./Step";
import studyBackground from "../../assets/studyackground.jpg"

import {
  applyToStudyGroup,
  leaveStudyGroup,
} from "../../apis/Group/StudyGroupApplication";
import { closeStudyGroup } from "../../apis/Group/StudyGroupManage";
import { getStudyGroupDetail, type StudyGroupDetail } from "../../apis/Group/StudyGroup";
import { getStudyByStep, type StepStudy } from "../../apis/Group/StudyGroupStep";
import { toggleGroupDibs } from "../../apis/Group/StudyGroupDibs";
import { getJoinGroup } from "../../apis/home/GroupList";
import { getAppliedGroup } from "../../apis/home/GroupList";
import { getImage } from "../../apis/common/File";
import { fetchStudyGroups, type StudyGroupItem } from "../../apis/common/studyGroups";

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
  const [groupImg, setGroupImg] = useState<string | null>(null);

  // fetchStudyGroups로 가져온 그룹 정보
  const [groupFromList, setGroupFromList] = useState<StudyGroupItem | null>(null);

  // 사용자 가입 그룹 확인
  const [isMember, setIsMember] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // 북마크 & 가입 버튼
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [canAccess, setCanAccess] = useState(true);
  const [loading, setLoading] = useState(false);

  // 스텝바
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
    return () => { mounted = false; };
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
    return () => { mounted = false; };
  }, [groupId, stepIdParam]);

  // 사용자 가입 그룹 확인
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getJoinGroup();
        if (!mounted) return;

        // response.content 배열에서 현재 groupId가 있는지 확인
        const hasGroup = response.content?.some((group: any) => group.id === groupId);
        setIsMember(Boolean(hasGroup));
      } catch (error) {
        console.error('가입 그룹 확인 실패:', error);
        if (mounted) {
          // API 호출 실패 시 북마크 제거
          setBookmarked(false);
          setCanAccess(false);
          setGroup((g) => (g ? { ...g, dibs: false } : g));
        }
      } finally {
        if (mounted) {
        }
      }
    })();
    return () => { mounted = false; };
  }, [groupId]);

  // 사용자 가입 신청 상태 확인
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getAppliedGroup();
        if (!mounted) return;

        // response.content 배열에서 현재 groupId가 있는지 확인
        const hasApplied = response.content?.filter((group: any) => group.studyGroup.id === groupId);
        setHasApplied(hasApplied.state === "PENDING" ? true : false);
      } catch (error) {
        console.error('가입 신청 상태 확인 실패:', error);
        if (mounted) {
          setHasApplied(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [groupId]);

  const joinButtonLabel = useMemo(() => {
    if (loading) return "처리 중...";

    // 멤버인 경우 "탈퇴" 표시
    if (isMember) return "탈퇴";

    // 가입 신청한 경우 "가입 취소" 표시
    if (hasApplied) return "가입 취소";

    // 그 외의 경우 "가입 신청" 표시
    return "가입 신청";
  }, [loading, isMember, hasApplied]);

  const isLeaveStyle = isMember || hasApplied;

  /** 찜 토글 */
  const handleBookmarkClick = async () => {
    if (bookmarking) return;
    setBookmarking(true);
    const prev = bookmarked;
    setBookmarked(!prev);

    try {
      const serverDibs = await toggleGroupDibs(groupId);
      setBookmarked(serverDibs);
      setGroup((g) => (g ? { ...g, dibs: serverDibs } : g));
    } catch (e: any) {
      setBookmarked(prev);
      const msg = e?.response?.data?.message || e?.message || "찜 처리에 실패했어요.";
      alert(msg); // 화면에 배지로 렌더링하지 않음
    } finally {
      setBookmarking(false);
    }
  };

  const handleJoinClick = async () => {
    try {
      setLoading(true);

      // 멤버인 경우 탈퇴 처리
      if (isMember) {
        await leaveStudyGroup(groupId);
        navigate("/mygroup?type=joined");
        setIsMember(false);
        return;
      }
      console.log(hasApplied)
      // 가입 신청한 경우 취소 처리
      if (hasApplied) {
        try {
          // 가입 신청 취소 api 연결
          navigate("/mygroup?type=joined");
        } catch (error) {
          console.error('가입 신청 취소 실패:', error);
          const msg = "가입 신청 취소에 실패했습니다.";
          alert(msg);
        }
        return;
      }

      // 가입 신청 처리
      await applyToStudyGroup(groupId);
      setHasApplied(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message ? "거절당한 그룹이에요" : e?.message || "요청 처리 중 오류가 발생했어요.";
      alert(msg);
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

  // fetchStudyGroups로 그룹 정보 가져오기
  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetchStudyGroups({ page: 0, size: 1000 });
      console.log(response.content)
      const items: StudyGroupItem[] = Array.isArray(response?.content)
        ? response.content
        : Array.isArray(response)
          ? (response as any)
          : [];
      const foundGroup = items.find(item => item.id === groupId);
      if (foundGroup) {
        setGroupFromList(foundGroup);
        // setCurrentStep(foundGroup.currentStep ?? 0);
        console.log(foundGroup)
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    if (!groupFromList?.groupImage) return;

    const fetchImages = async () => {
      if (groupFromList?.groupImage) {
        try {
          const response = await getImage(groupFromList.groupImage.uuid, groupFromList.groupImage.fileName);
          setGroupImg(response);
          console.log(response);
        } catch (error) {
          console.error(`이미지 로드 실패: ${groupFromList.groupImage.fileName}`, error);
        }
      }
    };

    fetchImages();
  }, [groupFromList?.groupImage]);

  return (
    <div className={styles.page__page__wrapper}>
      <img
        src={groupImg ?? studyBackground}
        alt="스터디 배경"
        className={styles.backgroundImage}
      />
      <div className={styles.page__wrapper}>
        <div className={styles.div__container}>
          <div className={styles.container__1}>
            <div className={styles.container__2}>
              {/* 그룹명: fetchStudyGroups에서 가져온 데이터 우선 사용 */}
              <div className={styles.title}>
                {groupFromList?.name ?? group?.name ?? "같이 공부 해요"}
              </div>
              {/* 소개 문구: fetchStudyGroups에서 가져온 데이터 우선 사용 */}
              <div className={styles.introduce}>
                {stepInfo?.title ?? groupFromList?.summary ?? group?.summary ?? "스터디가 처음이신 분들 함께해요!"}
              </div>
            </div>

            <div className={styles.container__3}>
              <div className={styles.hostName}>
                {group?.owner?.nickname ? `@${group.owner.nickname}` : "@" + (groupFromList?.owner?.nickname ?? "아무개")}
              </div>
            </div>

            <div className={styles.container__4}>
              <div className={styles.study__people}>스터디 정원</div>
              <div className={styles.study__people__info}>
                {(group?.memberCount ?? groupFromList?.memberCount ?? 0)}/{groupFromList?.maxMembers ?? group?.maxMembers ?? 0}
              </div>
            </div>

            <div className={styles.container__5}>
              <div className={styles.study__date}>스터디 일정</div>
              <div className={styles.study__date__info}>
                {fmt(group?.startDate ?? groupFromList?.startDate)}~{fmt(group?.endDate ?? groupFromList?.endDate)}
              </div>
            </div>

            <div className={styles.container__6}>
              {canAccess && (
                <button
                  type="button"
                  className={`${styles.Bookmark} ${bookmarked ? styles.BookmarkActive : ""}`}
                  onClick={handleBookmarkClick}
                  aria-pressed={bookmarked}
                  aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
                  disabled={bookmarking}
                >
                  <img src={bookmarked ? BookmarkOn : bookmark1} alt="북마크" />
                </button>
              )}

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

          {/* 카테고리: fetchStudyGroups에서 가져온 데이터 우선 사용 */}
          {(groupFromList?.categories?.length ?? group?.categories?.length ?? 0) > 0 && (
            <div className={styles.category__container} role="list">
              {(groupFromList?.categories ?? group?.categories ?? []).map((c) => (
                <div key={c.id} className={styles.categories} role="listitem">
                  # {c.name}
                </div>
              ))}
            </div>
          )}
          {/* ❌ 에러 텍스트 렌더링은 완전히 제거됨 */}
        </div>
      </div>

      <div className={styles.step__wrapper}>
        <Step totalSteps={totalSteps} currentStep={currentStepIndex} />
      </div>
    </div>
  );
}