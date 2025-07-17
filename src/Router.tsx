import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/home/Home"
import Layout from "./components/layout/Layout"

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}