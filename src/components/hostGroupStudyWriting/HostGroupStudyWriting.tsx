// src/components/hostGroupStudy/HostGroupStudyWriting.tsx
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ContentEditor } from "../common/ContentEditor";
import {
  saveStudyByStep,
  getStudyByStep,
  type StepStudy,
  type Attachment,
} from "../../apis/Group/StudyGroupStep";

type LocationState = { initial?: StepStudy };

export default function HostGroupStudyWriting() {
  const navigate = useNavigate();
  const { groupId, stepId } = useParams<{ groupId: string; stepId: string }>();
  const { state } = useLocation() as { state?: LocationState };

  const gid = Number(groupId);
  const step = Number(stepId);

  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // html
  const [fileList, setFileList] = useState<Attachment[]>([]);
  const [imageList, setImageList] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  const initialFromState = state?.initial;

  useEffect(() => {
    if (!Number.isFinite(gid) || !Number.isFinite(step)) return;

    const fill = (data: StepStudy) => {
      setEndDate(data.endDate ?? "");
      setTitle(data.title ?? "");
      setContent(data.content ?? "");
      setFileList(data.fileList ?? []);
      setImageList(data.imageList ?? []);
    };

    if (initialFromState) {
      fill(initialFromState);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = await getStudyByStep(gid, step);
        if (data) fill(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [gid, step, initialFromState]);

  // ✅ ContentEditor가 호출하는 onSubmit 어댑터(시그니처 맞춤)
  const handleEditorSubmit = async (
    nextTitle: string,
    nextContent: string,
    _newFiles: File[],
    _newImages: File[],
  ) => {
    if (!Number.isFinite(gid) || !Number.isFinite(step)) return;
    try {
      // TODO: _newFiles/_newImages 업로드 로직 붙이면 fileList/imageList 갱신
      await saveStudyByStep(gid, step, {
        endDate,
        title: nextTitle,
        content: nextContent,
        fileList,   // 기존 첨부 유지 (업로드 붙이면 갱신)
        imageList,  // 기존 첨부 유지
      });
      alert("저장 완료!");
      navigate(`/group/${gid}/step/${step}/MyGroupStudy`, { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "저장 실패";
      alert(msg);
    }
  };

  // ✅ ContentEditor 프리필 값
  const editorInitial = useMemo(
    () => ({ title, content }),
    [title, content]
  );

  return (
    <div className="wrapper">
      <ContentEditor
        wholeTitle="스터디 노트 작성하기"
        contentText="내 노트 내용"
        onSubmit={handleEditorSubmit}
        initialTitle={editorInitial.title}
        initialContent={editorInitial.content}
        loading={loading}
      />
    </div>
  );
}