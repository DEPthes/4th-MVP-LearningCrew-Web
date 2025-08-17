import { createContext, useContext, useState, type ReactNode } from 'react';

interface CurrentStepContextType {
  groupCurrentStep: number;
  setCurrentStep: (step: number) => void;
}

const CurrentStepContext = createContext<CurrentStepContextType | undefined>(undefined);

export function CurrentStepProvider({ children }: { children: ReactNode }) {
  const [groupCurrentStep, setCurrentStep] = useState<number>(1);

  return (
    <CurrentStepContext.Provider value={{
      groupCurrentStep,
      setCurrentStep
    }}>
      {children}
    </CurrentStepContext.Provider>
  );
}

export function useCurrentStep() {
  const context = useContext(CurrentStepContext);
  if (context === undefined || context === null) {
    throw new Error('currentStep must be used within a CurrentStepProvider');
  }
  return context;
}