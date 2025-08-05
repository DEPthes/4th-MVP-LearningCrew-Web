import Footer from "../common/Footer";
import Navbar from "../common/Navbar"; 
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet /> {/* 여기에 자식 Route의 element들이 렌더링됨 */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;