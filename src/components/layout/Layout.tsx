import Footer from "../common/Footer";
import Navbar from "../common/Navbar"; 
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;