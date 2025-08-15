import { useState } from "react";
import styles from "../../styles/fixedGroupHeader/Step.module.css";

export type StepStatus = "before" | "current" | "after";
export type StepPosition = "left" | "middle" | "right";

interface StepProps {
  totalSteps: number;
  currentStep: number; // 0-based
}

export default function Step({ totalSteps, currentStep }: StepProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const handleStepClick = (index: number, status: StepStatus) => {
    if (status === "current") {
      // 현재 스텝 클릭 → 기본 상태(현재 스텝이 MainColor2)로 복귀
      setSelectedStep(null);
      return;
    }
    // before/after 스텝 클릭 → 그 스텝만 강조(MainColor2)
    setSelectedStep(index);
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((step, index) => {
        // 상태 계산
        let status: StepStatus = "before";
        if (index < currentStep) status = "after";
        else if (index === currentStep) status = "current";

        // 위치 계산
        let position: StepPosition = "middle";
        if (index === 0) position = "left";
        else if (index === totalSteps - 1) position = "right";

        const isSelected = selectedStep === index; // before/after 선택 여부

        // 클래스 합성
        let className = `${styles.step} ${styles[position]}`;
        if (status === "before") {
          className += isSelected ? ` ${styles.selected}` : ` ${styles.before}`;
        } else if (status === "current") {
          // 아무 것도 선택되지 않았을 때만 현재 스텝이 메인컬러
          className += selectedStep === null ? ` ${styles.selected}` : ` ${styles.current}`;
        } else {
          // after
          className += isSelected ? ` ${styles.selected}` : ` ${styles.after}`;
        }

        return (
          <div
            key={index}
            className={className}
            onClick={() => handleStepClick(index, status)}
          >
            {step} Step
          </div>
        );
      })}
    </div>
  );
}