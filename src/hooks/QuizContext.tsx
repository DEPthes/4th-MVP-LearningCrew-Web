import React, { createContext, useContext, useState, type ReactNode } from 'react';
//퀴즈 context api

interface OptionProps {
  optionNum: number;
  quiz: number;
  content: string;
  isAnswer: boolean;
}

interface QuizProps {
  id: number;
  createdAt: string;
  quiz: string;
  step: number;
  options: OptionProps[];
}

interface QuizContextType {
  quizData: QuizProps[];
  setQuizData: (data: QuizProps[]) => void;
  currentQuizIndex: number;
  setCurrentQuizIndex: (index: number) => void;
  score: number;
  setScore: (score: number) => void;
  isQuizCompleted: boolean;
  setIsQuizCompleted: (completed: boolean) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined || context === null) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizProps[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const value: QuizContextType = {
    quizData,
    setQuizData,
    currentQuizIndex,
    setCurrentQuizIndex,
    score,
    setScore,
    isQuizCompleted,
    setIsQuizCompleted,
    resetQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
