import { useState } from "react"
import styles from "../../styles/fixedGroupHeader/Step.module.css"

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
    if (status === "after") {
      // 이전(진행 완료) 스텝 클릭: 그 스텝만 강조
      setSelectedStep(index);
    } else if (status === "current") {
      // 현재 스텝 클릭: 기본 상태로 복귀
      setSelectedStep(null);
    }
    // before는 클릭해도 변화 없음
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((step, index) => {
        let status: StepStatus = "before";
        if (index < currentStep) status = "after";
        else if (index === currentStep) status = "current";

        let position: StepPosition = "middle";
        if (index === 0) position = "left";
        else if (index === totalSteps - 1) position = "right";

        const isSelectedAfter = status === "after" && selectedStep === index;

        let className = `${styles.step} ${styles[position]}`;

        if (status === "before") {
          className += ` ${styles.before}`;
        } else if (status === "current") {
          // 아무 것도 선택되지 않은 기본 상태면 현재 스텝이 MainColor2
          className += selectedStep === null ? ` ${styles.selected}` : ` ${styles.current}`;
        } else if (status === "after") {
          className += isSelectedAfter ? ` ${styles.selected}` : ` ${styles.after}`;
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