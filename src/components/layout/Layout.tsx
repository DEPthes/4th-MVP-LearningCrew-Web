import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%"
    }}>
      <Navbar />
      <main style={{
        flex: 1,
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;