import { createContext, useContext, useState, type ReactNode } from 'react';

export type GroupTabType = 'MyGroupStudy' | 'myNote' | 'shareNote' | 'QandA' | 'quiz' | `QandADetail:${string}`;

interface GroupTabContextType {
  currentTab: GroupTabType;
  setCurrentTab: (tab: GroupTabType) => void;
}

const GroupTabContext = createContext<GroupTabContextType | undefined>(undefined);

interface GroupTabProviderProps {
  children: ReactNode;
}

export const GroupTabProvider = ({ children }: GroupTabProviderProps) => {
  const [currentTab, setCurrentTab] = useState<GroupTabType>('MyGroupStudy');

  const value: GroupTabContextType = {
    currentTab,
    setCurrentTab,
  };

  return (
    <GroupTabContext.Provider value={value}>
      {children}
    </GroupTabContext.Provider>
  );
};

export const useGroupTab = () => {
  const context = useContext(GroupTabContext);
  if (context === undefined) {
    throw new Error('useGroupTab must be used within a GroupTabProvider');
  }
  return context;
};
