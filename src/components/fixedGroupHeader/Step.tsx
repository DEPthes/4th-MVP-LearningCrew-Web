import styles from "../../styles/fixedGroupHeader/Step.module.css";

// Step 상태 타입
export type StepStatus = "before" | "current" | "after";
export type StepPosition = "left" | "middle" | "right";

interface StepProps {
  totalSteps: number;
  currentStep: number; // 0부터 시작하는 index
}

export default function Step({ totalSteps, currentStep }: StepProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      {steps.map((step, index) => {
        let status: StepStatus = "before";
        if (index < currentStep) status = "after";
        else if (index === currentStep) status = "current";

        let position: StepPosition = "middle";
        if (index === 0) position = "left";
        else if (index === totalSteps - 1) position = "right";

        const className = `${styles.step} ${styles[status]} ${styles[position]}`;

        return (
          <div key={index} className={className}>
            {step} Step
          </div>
        );
      })}
    </div>
  );
}