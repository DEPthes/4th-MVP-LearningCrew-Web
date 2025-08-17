import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 레이아웃
import Layout from "./components/layout/Layout";
import MinimalLayout from "./components/layout/MinimalLayout";
import MainLayout from "./components/layout/MainLayout";
import GroupLayout from "./components/layout/GroupLayout";

// 페이지
import { Home } from "./pages/home/Home";
import MyGroup from "./pages/myGroup/MyGroup";
import MyPageHome from "./pages/myPage/MyPage";
import FavoriteGroupList from "./pages/myPage/FavoriteGroupList";
import EditProfile from "./pages/myPage/EditProfile";
import Login from "./components/login/Login";
import WelcomePage from "./components/welcomePage/WelcomePage";
import SignUp from "./pages/signUp/SignUp";
import { CreateGroup } from "./pages/createGroup/CreateGroup";
import { MyNote } from "./pages/myNote/MyNote";
import { MyNoteWrite } from "./pages/myNote/MyNoteWrite";
import { ShareNoteList } from "./pages/shareNote/ShareNoteList";
import { ShareNoteDetail } from "./pages/shareNote/ShareNoteDetail";
import { QandAList } from "./pages/QandA/QandAList";
import { QandAWrite } from "./pages/QandA/QandAWrite";
import { QandADetail } from "./pages/QandA/QandADetail";
import { Quiz } from "./pages/quiz/Quiz";
import { QuizQ } from "./pages/quiz/QuizQ";

// 주최자 전용
import HostGroupStudyWriting from "./components/hostGroupStudyWriting/HostGroupStudyWriting";
import HostGroupParticipants from "./components/hostGroupParticipants/HostGroupParticipants";

// ✅ 스터디 탭 스위치(주최자면 Host, 아니면 My)
import StudySwitch from "./components/study/StudySwitch";

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

        {/* 그룹 공통 레이아웃(배너/좌측메뉴 유지) */}
        <Route element={<Layout />}>
          <Route path="/group/:groupId">
            {/* /group/:groupId  -> step/1 로 */}
            <Route index element={<Navigate to="step/1" replace />} />

            <Route path="step/:stepId" element={<GroupLayout />}>
              {/* 기본 탭은 Study */}
              <Route index element={<Navigate to="MyGroupStudy" replace />} />

              {/* ✅ Study: 스위치 사용 (HostGroupStudy vs MyGroupStudy) */}
              <Route path="MyGroupStudy" element={<StudySwitch />} />
              {/* ✅ 작성/수정 페이지(주최자) */}
              <Route path="MyGroupStudy/write" element={<HostGroupStudyWriting />} />

              {/* 나머지 탭 */}
              <Route path="myNote" element={<MyNote />} />
              <Route path="myNote/write" element={<MyNoteWrite />} />
              <Route path="shareNote" element={<ShareNoteList />} />
              <Route path="shareNoteDetail/:noteId" element={<ShareNoteDetail />} />
              <Route path="QandA" element={<QandAList />} />
              <Route path="QandA/write" element={<QandAWrite />} />
              <Route path="QandADetail/:qId" element={<QandADetail />} />
              <Route path="quiz" element={<Quiz />} />

              {/* ✅ 주최자 전용 Member */}
              <Route path="member" element={<HostGroupParticipants />} />
            </Route>
          </Route>
        </Route>

        {/* 단독 라우트 */}
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