import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContentEditor } from "../common/ContentEditor";
import { saveStudyByStep, getStudyByStep, type StepStudy } from "../../apis/Group/StudyGroupStep";

export default function HostGroupStudyWriting() {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const [initial, setInitial] = useState<StepStudy | undefined>();
  const [endDate, setEndDate] = useState("");

  const gid = Number(groupId);
  const step = Number(stepId);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStudyByStep(gid, step);
        if (data) {
          setInitial(data);
          setEndDate(data.endDate ?? "");
        }
      } catch {/* 조회 실패는 신경 안 씀(처음 작성일 수 있으니까) */}
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
      {/* endDate 입력 UI는 기존 그대로 사용 */}
      <ContentEditor
        wholeTitle="스터디 노트 작성하기"
        contentText="내 노트 내용"
        onSubmit={handleSubmit}
      />
    </div>
  );
}