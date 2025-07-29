import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/home/Home"
import Layout from "./components/layout/Layout"
import Login from "./components/login/Login"
import WelcomePage from "./components/welcomePage/WelcomePage"
import SignUp from "./components/signUp/SignUp"
import { ShareNoteList } from "./pages/shareNote/ShareNoteList"
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcomePage" element={<WelcomePage />} />
        <Route path="/" element={<Layout> <Home /> </Layout>} />
        <Route path="/shareNoteList" element={<ShareNoteList />} />
        <Route path="/shareNoteDetail/:id" element={<ShareNoteDetail />} />
      </Routes>
    </BrowserRouter>
  )
}