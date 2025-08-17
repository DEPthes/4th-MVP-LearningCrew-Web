import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SearchKeywordContextType {
  searchKeyword: string | null;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;
  type: "joined" | "hosted" | "applied";
  setType: (type: "joined" | "hosted" | "applied") => void;
}

const SearchKeywordContext = createContext<SearchKeywordContextType | undefined>(undefined);

export function SearchKeywordProvider({ children }: { children: ReactNode }) {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [type, setType] = useState<"joined" | "hosted" | "applied">("joined");
  const clearSearchKeyword = () => {
    setSearchKeyword('');
  };

  useEffect(() => {
    clearSearchKeyword();
  }, [type]);

  return (
    <SearchKeywordContext.Provider value={{
      searchKeyword,
      setSearchKeyword,
      clearSearchKeyword,
      type,
      setType
    }}>
      {children}
    </SearchKeywordContext.Provider>
  );
}

export function useSearchKeyword() {
  const context = useContext(SearchKeywordContext);
  if (context === undefined) {
    throw new Error('useSearchKeyword must be used within a SearchKeywordProvider');
  }
  return context;
}