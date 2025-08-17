// src/components/fixedGroupHeader/Step.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/Step.module.css";
import { useGroupTab } from "../../hooks/GroupTabContext";
import { useCurrentStep } from "../../hooks/CurrentStepContext";

interface StepProps {
  totalSteps: number;   // 전체 스텝 수
  currentStep: number;  // 0-based 현재 스텝 인덱스
}

export default function Step({ totalSteps, currentStep }: StepProps) {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const { currentTab } = useGroupTab();
  const { groupCurrentStep } = useCurrentStep();//그룹 현재 스탭 받아오기(변하지 않는 값)

  // 선택된 스텝(0-based). null이면 기본 모드(현재 스텝 강조).
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  // URL(stepId) 바뀌면 선택 해제 → 기본 모드 복귀
  useEffect(() => {
    setSelectedIndex(null);
  }, [stepId]);

  // ✅ 라우팅용 탭 이름을 안전하게 정규화
  // - Study → MyGroupStudy 로 강제 매핑 (404 방지)
  // - 빈값이거나 알 수 없으면 MyGroupStudy 기본값
  const getSafeTab = () => {
    const t = (currentTab || "").toLowerCase();
    if (t === "study" || t === "mygroupstudy") return "MyGroupStudy";
    // 필요하면 다른 탭도 허용
    if (t === "mynote") return "myNote";
    if (t === "sharenote") return "shareNote";
    if (t === "q&a" || t === "qandA".toLowerCase()) return "QandA";
    if (t === "quiz") return "quiz";
    return "MyGroupStudy";
  };

  const handleClick = (index: number) => {
    if (index === currentStep) setSelectedIndex(null);
    else setSelectedIndex(index);

    const safeTab = getSafeTab();
    const target = `/group/${groupId}/step/${index + 1}/${safeTab}`;
    // 디버그용 로그: 실제 이동 경로 확인
    console.log("[Step] navigate to:", target, "(from tab:", currentTab, "→ safe:", safeTab, ")");
    navigate(target);
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((idx) => {
        // 좌/중/우 모양 클래스 (모양/정렬 그대로 유지)
        let pos = styles.middle;
        if (idx === 0) pos = styles.left;
        else if (idx === totalSteps - 1) pos = styles.right;

        // 상태별 색상 규칙
        let stateClass: string;
        if (selectedIndex === null) {
          if (idx === currentStep) stateClass = styles.selected;     // 진한 주황 (현재 스텝)
          else if (idx <= groupCurrentStep) stateClass = styles.after;     // 연한 주황 (그룹 현재 스텝까지)
          else stateClass = styles.before;                           // 회색 (그룹 현재 스텝 초과)
        } else {
          if (idx === selectedIndex) stateClass = styles.selected;   // 진한 주황 (선택된 하나)
          else if (idx <= groupCurrentStep) stateClass = styles.after;     // 연한 주황 (그룹 현재 스텝까지 유지)
          else if (idx === currentStep) stateClass = styles.current; // 진한 주황 (현재 스텝도 진한 주황으로)
          else stateClass = styles.before;                           // 회색 (그룹 현재 스텝 초과)
        }


        return (
          <div
            key={idx}
            className={`${styles.step} ${pos} ${stateClass}`}
            onClick={() => handleClick(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleClick(idx)
            }
          >
            {idx + 1} Step
          </div>
        );
      })}
    </div>
  );
}