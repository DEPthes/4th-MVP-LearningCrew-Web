
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* header and gnb */}
      <div>{children}</div>
      {/* footer */}
    </>
  )
}
export default Layout;