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

  // requestAnimationFrame을 사용해서 검색 키워드 변경을 안전하게 처리
  const setSearchKeywordSafe = (keyword: string) => {
    requestAnimationFrame(() => {
      setSearchKeyword(keyword);
    });
  };

  useEffect(() => {
    clearSearchKeyword();
  }, [type]);

  return (
    <SearchKeywordContext.Provider value={{
      searchKeyword,
      setSearchKeyword: setSearchKeywordSafe,
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
  if (context === undefined || context === null) {
    throw new Error('useSearchKeyword must be used within a SearchKeywordProvider');
  }
  return context;
}