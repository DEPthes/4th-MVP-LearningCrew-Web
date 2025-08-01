import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/home/Home"
import Layout from "./components/layout/Layout"
import Login from "./components/login/Login"
import WelcomePage from "./components/welcomePage/WelcomePage"
import SignUp from "./components/signUp/SignUp"
import { CreateGroup } from "./pages/createGroup/CreateGroup"
import { ShareNoteList } from "./pages/shareNote/ShareNoteList"
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail"
import { QandAWrite } from "./pages/QandA/QandAWrite"
import { QandAList } from "./pages/QandA/QandAList"
import { QandADetail } from "./pages/QandA/QandADetail"
import { MyNote } from "./pages/myNote/MyNote"
import { MyNoteWrite } from "./pages/myNote/MyNoteWrite"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcomePage" element={<WelcomePage />} />
        <Route path="/" element={<Layout> <Home /> </Layout>} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/shareNote" element={<ShareNoteList />} />
        <Route path="/shareNoteDetail/:id" element={<ShareNoteDetail />} />
        <Route path="/QandA" element={<QandAList />} />
        <Route path="/QandA/write" element={<QandAWrite />} />
        <Route path="/QandADetail/:id" element={<QandADetail />} />
        <Route path="/myNote" element={<MyNote />} />
        <Route path="/myNote/write" element={<MyNoteWrite />} />
      </Routes>
    </BrowserRouter>
  )
}