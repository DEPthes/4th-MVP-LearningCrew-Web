import Navbar from "../common/Navbar"; 

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* header and gnb */}
      <div>{children}</div>
      {/* footer */}
    </>
  )
}
export default Layout;