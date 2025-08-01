import { useParams } from "react-router-dom";
import { ShareNoteListDummy } from "../../assets/shareNoteListDummy";
import { PostDetail } from "../../components/common/PostDetail";

export const ShareNoteDetail = () => {
  const { id } = useParams<{ id: string }>();

  // id로 해당 노트 찾기
  const note = ShareNoteListDummy.find(note => note.id === Number(id));

  return (
    <>
      <PostDetail data={note} />
    </>
  );
};