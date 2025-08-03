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
import Menu from "./components/fixedGroupHeader/Menu"
import Step from "./components/fixedGroupHeader/Step"
import FixedBanner from "./components/fixedGroupHeader/FixedBanner"
import { CreateGroup } from "./pages/createGroup/CreateGroup"
import { ShareNoteList } from "./pages/shareNote/ShareNoteList"
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail"
import { QandAWrite } from "./pages/QandA/QandAWrite"
import { QandAList } from "./pages/QandA/QandAList"
import { QandADetail } from "./pages/QandA/QandADetail"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/FixedBanner" element ={<FixedBanner />} />
        <Route path="/Step" element ={<Step totalSteps={7} currentStep={1} />} />
        <Route path="/Menu" element ={<Menu />} />
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
        <Route path="/shareNoteList" element={<ShareNoteList />} />
        <Route path="/shareNoteDetail/:id" element={<ShareNoteDetail />} />
        <Route path="/QandAList" element={<QandAList />} />
        <Route path="/QandAWrite" element={<QandAWrite />} />
        <Route path="/QandADetail/:id" element={<QandADetail />} />
      </Routes>
    </BrowserRouter>
  )
}