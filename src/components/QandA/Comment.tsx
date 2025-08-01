import { useState } from "react";
import { CommentList } from "./CommentList";
import { CommentInput } from "./CommentInput";

interface DataProps {
  id: number;
  profile: string | null;
  writer: string;
  content: string;
  createdAt: string;
  image: string | null;
}

interface CommentProps {
  comments?: DataProps[];
}

export const Comment = ({ comments }: CommentProps) => {
  const [commentList, setCommentList] = useState<DataProps[] | undefined>(comments);

  const handleCommentSubmit = (newComment: { writer: string; content: string }) => {
    const newCommentItem: DataProps = {
      id: Date.now(),
      profile: null,//수정 필요
      writer: newComment.writer,
      content: newComment.content,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      image: null,
    };

    setCommentList(prev => prev ? [newCommentItem, ...prev] : [newCommentItem]);
  };

  return (
    <>
      <CommentList comments={commentList} />
      <CommentInput onSubmit={handleCommentSubmit} />
    </>
  );
};