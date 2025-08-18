import { useEffect, useState } from "react";
import { CommentList } from "./CommentList";
import { CommentInput } from "./CommentInput";
import { useParams } from "react-router-dom";
import { getComments, postComment } from "../../apis/studygroup/QandA";

interface FileProps {
  uuid: string;
  size: number;
  fileName: string;
  handlingType: string;
}

interface CreatedProps {
  id: number;
  nickname: string;
  profileImage: FileProps;
}

interface DataProps {
  id: number;
  content: string;
  attachedImages: FileProps[];
  attachedFiles: FileProps[];
  createdAt: string;
  createdBy: CreatedProps;
}

interface PostCommentProps {
  content: string;
  attachedImages?: File[];
  attachedFiles?: File[];
}
export const Comment = () => {
  const { groupId, qId } = useParams<{ groupId: string; qId: string }>();
  const [comments, setComments] = useState<DataProps[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (groupId && qId) {
          const response = await getComments({ groupId: groupId, qnaId: qId });
          setComments(response.content);
        }
      } catch (error) {
        console.error("댓글 조회 실패:", error);
      }
    }
    fetchComments();
  }, [qId]);

  const handleCommentSubmit = (data: PostCommentProps) => {
    const fetchComment = async () => {
      try {
        if (groupId && qId && data.content) {
          const response = await postComment(
            { groupId, qnaId: qId, content: data.content, attachedImages: data.attachedImages || [], attachedFiles: data.attachedFiles || [] }
          );

          // 댓글 제출 성공 후 댓글 목록 새로고침
          if (response) {
            const updatedComments = await getComments({ groupId: groupId, qnaId: qId });
            setComments(updatedComments.content);
          }
        }
      } catch (error) {
        console.error("댓글 생성 실패:", error);
      }
    }
    fetchComment();
  };

  return (
    <>
      <CommentList comments={comments} />
      <CommentInput onSubmit={handleCommentSubmit} />
    </>
  );
};