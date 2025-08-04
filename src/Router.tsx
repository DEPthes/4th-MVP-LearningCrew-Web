import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/home/Home"
import Layout from "./components/layout/Layout"
import Login from "./components/login/Login"
import WelcomePage from "./components/welcomePage/WelcomePage"
import SignUp from "./pages/signUp/SignUp"
import MyGroupStudy from "./components/myGroupStudy/MyGroupStudy"
import HostGroupStudyWriting from "./components/hostGroupStudyWriting/HostGroupStudyWriting"
import HostGroupStudy from "./components/hostGroupStudy/HostGroupStudy"
import HostGroupParticipants from "./components/hostGroupParticipants/HostGroupParticipants"
import HostGroupApplicant from "./components/hostGroupApplicant/HostGroupApplicant"
import { CreateGroup } from "./pages/createGroup/CreateGroup"
import { ShareNoteList } from "./pages/shareNote/ShareNoteList"
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail"
import { QandAWrite } from "./pages/QandA/QandAWrite"
import { QandAList } from "./pages/QandA/QandAList"
import { QandADetail } from "./pages/QandA/QandADetail"
import { MyNote } from "./pages/myNote/MyNote"
import { MyNoteWrite } from "./pages/myNote/MyNoteWrite"
import { Quiz } from "./pages/quiz/Quiz"
import { QuizQ } from "./pages/quiz/QuizQ"
import MyPageHome from "./pages/myPage/MyPage"
import EditProfile from "./pages/myPage/EditProfile"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/HostGroupApplicant" element ={<HostGroupApplicant />} />
        <Route path="/HostGroupParticipants" element ={<HostGroupParticipants />} />
        <Route path="/HostGroupStudy" element ={<HostGroupStudy />} />
        <Route path="/HostGroupStudyWriting" element ={<HostGroupStudyWriting />} />
        <Route path="/MyGroupStudy" element={<MyGroupStudy title="예시제목" content="예시내용입니다." />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcomePage" element={<WelcomePage />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/shareNote" element={<ShareNoteList />} />
        <Route path="/shareNoteDetail/:id" element={<ShareNoteDetail />} />
        <Route path="/QandA" element={<QandAList />} />
        <Route path="/QandA/write" element={<QandAWrite />} />
        <Route path="/QandADetail/:id" element={<QandADetail />} />
        <Route path="/myNote" element={<MyNote />} />
        <Route path="/myNote/write" element={<MyNoteWrite />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/questions" element={<QuizQ />} />
        <Route path="/mypage" element={<Layout><MyPageHome /></Layout>} />
        <Route path="/myPage/edit" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}