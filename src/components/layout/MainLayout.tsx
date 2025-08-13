import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import bannerImg from "../../assets/banner.svg";

const MainLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div style={{ width: "100%", minWidth: "1024px",position: "relative" }}>
        <img
          src={bannerImg}
          alt="배너"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
