import { createContext, useContext, useState, type ReactNode } from "react";

type NavbarTab = "홈" | "내그룹" | "마이페이지";

interface NavbarContextType {
  activeTab: NavbarTab;
  setActiveTab: (tab: NavbarTab) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavbarTab>("홈");

  return (
    <NavbarContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}