import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/fixedGroupHeader/Step.module.css";

interface StepProps {
  totalSteps: number;   // 전체 스텝 수 (예: 6)
  currentStep: number;  // 0-based 현재 스텝 인덱스 (예: stepId - 1)
}

export default function Step({ totalSteps, currentStep }: StepProps) {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();

  // 선택된 스텝 인덱스(0-based). null이면 기본 모드(현재 스텝 강조)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  // URL(stepId) 바뀌면 선택 해제 → 기본(현재 스텝 강조)로 복귀
  useEffect(() => {
    setSelectedIndex(null);
  }, [stepId]);

  const handleClick = (index: number) => {
    // 현재 스텝 클릭 → 선택 해제(기본 모드)
    if (index === currentStep) setSelectedIndex(null);
    else setSelectedIndex(index);

    // 라우트 이동 (1-based)
    navigate(`/group/${groupId}/step/${index + 1}`);
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((idx) => {
        // 모양(좌/중/우)
        let pos = styles.middle;
        if (idx === 0) pos = styles.left;
        else if (idx === totalSteps - 1) pos = styles.right;

        // 상태에 따른 색상 클래스
        let stateClass: string;
        if (selectedIndex === null) {
          // 기본 상태: 진행=갈색, 현재=주황, 미진행=회색
          if (idx === currentStep) stateClass = styles.selected;     // 주황
          else if (idx < currentStep) stateClass = styles.after;     // 갈색
          else stateClass = styles.before;                           // 회색
        } else {
          // 선택 상태: 선택만 주황, 현재는 갈색, 나머지 전부 회색
          if (idx === selectedIndex) stateClass = styles.selected;   // 주황
          else if (idx === currentStep) stateClass = styles.current; // 갈색(현재)
          else stateClass = styles.before;                           // 회색
        }

        // 겹침 해결: 주황만 맨 위로 올려서 줄줄이 주황처럼 보이는 현상 방지
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