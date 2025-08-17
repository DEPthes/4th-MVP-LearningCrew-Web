import { useParams } from "react-router-dom";
import { PostDetail } from "../../components/common/PostDetail";
import { getDetailNote } from "../../apis/studygroup/Note";
import { useState, useEffect } from "react";
import { useGroupTab } from "../../hooks/GroupTabContext";

export const ShareNoteDetail = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [noteData, setNoteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentTab } = useGroupTab();

  useEffect(() => {
    setCurrentTab('shareNote');
  }, [setCurrentTab]);

  useEffect(() => {
    const fetchNoteDetail = async () => {
      if (noteId) {
        try {
          const response = await getDetailNote(noteId);
          setNoteData(response);
          setLoading(false);
        } catch (error) {
          console.error("노트 상세 정보를 가져오는데 실패했습니다:", error);
          setLoading(false);
        }
      }
    };

    fetchNoteDetail();
  }, [noteId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!noteData) {
    return <div>노트를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <PostDetail data={noteData} />
    </>
  );
};