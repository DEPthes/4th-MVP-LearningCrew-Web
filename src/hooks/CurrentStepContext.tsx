import { createContext, useContext, useState, type ReactNode } from 'react';

interface FileMeta {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
}

interface CategoryType {
  id: number;
  name: string;
}

interface CurrentStepContextType {
  id: number;
  setId: (id: number) => void;
  groupCurrentStep: number;
  setCurrentStep: (step: number) => void;
  summary: string;
  setSummary: (summary: string) => void;
  maxMembers: number;
  setMaxMembers: (maxMembers: number) => void;
  groupImage: FileMeta;
  setGroupImage: (groupImage: FileMeta) => void;
  categories: CategoryType[];
  setCategories: (categories: CategoryType[]) => void;
}

const CurrentStepContext = createContext<CurrentStepContextType | undefined>(undefined);

export function CurrentStepProvider({ children }: { children: ReactNode }) {
  const [groupCurrentStep, setCurrentStep] = useState<number>(0);
  const [id, setId] = useState<number>(0);
  const [summary, setSummary] = useState<string>("");
  const [maxMembers, setMaxMembers] = useState<number>(0);
  const [groupImage, setGroupImage] = useState<FileMeta>({
    uuid: "",
    fileName: "",
    size: 0,
    handlingType: "",
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);

  return (
    <CurrentStepContext.Provider value={{
      id,
      setId,
      groupCurrentStep,
      setCurrentStep,
      summary,
      setSummary,
      maxMembers,
      setMaxMembers,
      groupImage,
      setGroupImage,
      categories,
      setCategories
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