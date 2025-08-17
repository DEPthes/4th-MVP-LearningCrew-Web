import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContentEditor } from "../common/ContentEditor";
import { saveStudyByStep, getStudyByStep } from "../../apis/Group/StudyGroupStep";

export default function HostGroupStudyWriting() {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();

  const [endDate, setEndDate] = useState("");

  const gid = Number(groupId);
  const step = Number(stepId);

  // 기존 데이터가 있으면 endDate만 프리필
  useEffect(() => {
    if (!gid || !step) return;
    (async () => {
      try {
        const data = await getStudyByStep(gid, step);
        if (data?.endDate) setEndDate(data.endDate);
      } catch {
        /* 최초 작성이면 404 가능 → 무시 */
      }
    })();
  }, [gid, step]);

  const handleSubmit = async (title: string, content: string) => {
    if (!gid || !step) return;
    try {
      await saveStudyByStep(gid, step, { endDate, title, content });
      alert("저장 완료!");
      navigate(`/group/${gid}/step/${step}/MyGroupStudy`, { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "저장 실패";
      alert(msg);
    }
  };

  return (
    <div className="wrapper">
      {/* endDate 입력 UI가 따로 있다면 여기에서 setEndDate 연결해서 사용 */}
      <ContentEditor
        wholeTitle="스터디 노트 작성하기"
        contentText="내 노트 내용"
        onSubmit={handleSubmit}
      />
    </div>
  );
}