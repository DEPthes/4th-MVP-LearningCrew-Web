// src/Router.tsx
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { Home } from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import MinimalLayout from "./components/layout/MinimalLayout";
import Login from "./components/login/Login";
import WelcomePage from "./components/welcomePage/WelcomePage";
import SignUp from "./pages/signUp/SignUp";
import MyGroupStudy from "./components/myGroupStudy/MyGroupStudy";
import HostGroupStudyWriting from "./components/hostGroupStudyWriting/HostGroupStudyWriting";
import HostGroupStudy from "./components/hostGroupStudy/HostGroupStudy";
import HostGroupParticipants from "./components/hostGroupParticipants/HostGroupParticipants";
import HostGroupApplicant from "./components/hostGroupApplicant/HostGroupApplicant";
import FixedBanner from "./components/fixedGroupHeader/FixedBanner";
import { CreateGroup } from "./pages/createGroup/CreateGroup";
import { ShareNoteList } from "./pages/shareNote/ShareNoteList";
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail";
import { QandAWrite } from "./pages/QandA/QandAWrite";
import { QandAList } from "./pages/QandA/QandAList";
import { QandADetail } from "./pages/QandA/QandADetail";
import { MyNote } from "./pages/myNote/MyNote";
import { MyNoteWrite } from "./pages/myNote/MyNoteWrite";
import { Quiz } from "./pages/quiz/Quiz";
import { QuizQ } from "./pages/quiz/QuizQ";
import MyPageHome from "./pages/myPage/MyPage";
import EditProfile from "./pages/myPage/EditProfile";
import FavoriteGroupList from "./pages/myPage/FavoriteGroupList";
import ParticipantMenu from "./components/fixedGroupHeader/ParticipantMenu";
import GroupLayout from "./components/layout/GroupLayout";
import MyGroup from "./pages/myGroup/MyGroup";
import MainLayout from "./components/layout/MainLayout";

// ✅ 소유자 여부 훅 추가
import { useIsGroupOwner } from "./hooks/useMyGroup";

// --- Helper Pages to pass :groupId ---
const FixedBannerPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { isOwner } = useIsGroupOwner(groupId!);
  return <FixedBanner groupId={Number(groupId)} isOwner={!!isOwner} />;
};

const HostGroupApplicantPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  return <HostGroupApplicant groupId={Number(groupId)} />;
};

const HostGroupParticipantsPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  return <HostGroupParticipants groupId={Number(groupId)} />;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Navbar + banner + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mygroup" element={<MyGroup />} />
        </Route>

        {/* Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/mypage" element={<MyPageHome />} />
          <Route path="/mypage/favorite" element={<FavoriteGroupList />} />
        </Route>

        {/* Navbar (footer x) */}
        <Route element={<MinimalLayout />}>
          <Route path="/mygroup/create" element={<CreateGroup />} />
          <Route path="group/:groupId/step/:stepId/quiz/questions" element={<QuizQ />} />
        </Route>

        {/* 그룹 전용 레이아웃 */}
        <Route element={<Layout />}>
          <Route path="/group/:groupId">
            {/* ✅ 상대경로로 기본 step/1로 리다이렉트 */}
            <Route index element={<Navigate to="step/1" replace />} />
            <Route path="step/:stepId" element={<GroupLayout />}>
              {/* 기본은 Study 탭 */}
              <Route index element={<Navigate to="MyGroupStudy" replace />} />
              <Route path="MyGroupStudy" element={<MyGroupStudy />} />
              <Route path="myNote" element={<MyNote />} />
              <Route path="myNote/write" element={<MyNoteWrite />} />
              <Route path="shareNote" element={<ShareNoteList />} />
              <Route path="shareNoteDetail/:noteId" element={<ShareNoteDetail />} />
              <Route path="QandA" element={<QandAList />} />
              <Route path="QandA/write" element={<QandAWrite />} />
              <Route path="QandADetail/:qId" element={<QandADetail />} />
              <Route path="quiz" element={<Quiz />} />
            </Route>
          </Route>
        </Route>

        {/* 단독 컴포넌트 */}
        <Route path="/ParticipantMenu" element={<ParticipantMenu />} />
        <Route path="/group/:groupId/banner" element={<FixedBannerPage />} />
        <Route path="/group/:groupId/applicants" element={<HostGroupApplicantPage />} />
        <Route path="/group/:groupId/participants" element={<HostGroupParticipantsPage />} />
        <Route path="/HostGroupStudy" element={<HostGroupStudy />} />
        <Route path="/HostGroupStudyWriting" element={<HostGroupStudyWriting />} />
        {/* ⛔️ 최상위 MyGroupStudy 라우트는 충돌 소지 있어 제거 권장 (필요하면 남겨도 무방)
        <Route path="MyGroupStudy" element={<MyGroupStudy />} />
        */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/mypage/edit" element={<EditProfile />} />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};