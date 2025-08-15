// src/components/fixedGroupHeader/Step.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/Step.module.css";

interface StepProps {
  totalSteps: number;   // 전체 스텝 수
  currentStep: number;  // 0-based 현재 스텝 인덱스
}

export default function Step({ totalSteps, currentStep }: StepProps) {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();

  // 선택된 스텝(0-based). null이면 기본 모드(현재 스텝 강조).
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  // URL(stepId) 바뀌면 선택 해제 → 기본 모드 복귀
  useEffect(() => {
    setSelectedIndex(null);
  }, [stepId]);

  const handleClick = (index: number) => {
    if (index === currentStep) setSelectedIndex(null);
    else setSelectedIndex(index);
    navigate(`/group/${groupId}/step/${index + 1}`);
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((idx) => {
        // 좌/중/우 모양 클래스 (모양/정렬 그대로 유지)
        let pos = styles.middle;
        if (idx === 0) pos = styles.left;
        else if (idx === totalSteps - 1) pos = styles.right;

        // 상태별 색상 규칙
        // - 기본:  미진행=회색, 현재=주황, 진행완료=갈색
        // - 선택:  "선택된 것만" 주황으로 바꾸고,
        //           진행완료는 계속 갈색, 현재도 갈색, 그 외(미진행)는 회색
        let stateClass: string;
        if (selectedIndex === null) {
          if (idx === currentStep) stateClass = styles.selected;     // 주황
          else if (idx < currentStep) stateClass = styles.after;     // 갈색
          else stateClass = styles.before;                           // 회색
        } else {
          if (idx === selectedIndex) stateClass = styles.selected;   // 주황 (선택된 하나)
          else if (idx < currentStep) stateClass = styles.after;     // 갈색(진행완료 유지)
          else if (idx === currentStep) stateClass = styles.current; // 갈색(현재도 갈색으로)
          else stateClass = styles.before;                           // 회색
        }

        // 겹칠 때 오른쪽 카드가 왼쪽 카드 위에 오도록 z-index를 증가시키고,
        // 선택된 것만 가장 위로 올림(색 번짐 방지)
        const z = stateClass === styles.selected ? 1000 : idx + 1;

        return (
          <div
            key={idx}
            className={`${styles.step} ${pos} ${stateClass}`}
            // style={{ zIndex: z }}
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