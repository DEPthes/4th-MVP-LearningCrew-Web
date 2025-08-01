import { useEffect, useState } from "react";
import styles from "../../styles/QandA/Comment.module.css";
import { Sort } from "../common/Sort";

interface DataProps {
  id: number;
  profile: string | null;
  writer: string;
  content: string;
  createdAt: string;
  image: string | null;
}

interface CommentListProps {
  comments?: DataProps[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  const [sort, setSort] = useState<string>("최신순");
  const [sortedComments, setSortedComments] = useState<DataProps[] | undefined>(comments);

  useEffect(() => {
    if (!comments) return;

    if (sort === "오래된순") {
      setSortedComments([...comments].reverse());
    } else if (sort === "관련도순") {
      setSortedComments([...comments].sort((a, b) => a.content.localeCompare(b.content)));
    } else if (sort === "가나다순") {
      setSortedComments([...comments].sort((a, b) => a.writer.localeCompare(b.writer)));
    } else {
      setSortedComments([...comments]);
    }
  }, [sort, comments]);

  return (
    <div className={styles.comment__container}>
      <div className={styles.comment__header}>
        <p>댓글</p>
        <div className={styles.comment__sort}><Sort sort={sort} setSort={setSort} /></div>
      </div>
      <div className={styles.comment__content__container}>
        {comments ?
          sortedComments?.map((comment, index) => (
            <div
              key={comment.id}
              className={styles.comment__content__each}
              style={{ borderBottom: index + 1 === sortedComments.length ? "none" : "2px solid var(--Gray4)" }}
            >
              <div className={styles.comment__content__each__header}>
                {comment.profile ?
                  <>
                    <img src={comment.profile} />
                  </>
                  :
                  <div className={styles.comment__profile__none}>
                    <p className={styles.comment__profile__none__word}>{comment.writer.slice(0, 1)}</p>
                  </div>}
                <p className={styles.comment__content__each__writer}>{comment.writer} 님</p>
                <p className={styles.comment__content__each__date}>{comment.createdAt}</p>
              </div>
              <div className={styles.comment__content__each__content}>
                <p>{comment.content}</p>
                {comment.image && <img src={comment.image} />}
              </div>
            </div>
          )) :
          <div className={styles.comment__content__none}>해당 질문에 댓글이 존재하지 않습니다. 첫 댓글을 남겨보세요!</div>}
      </div>
    </div>
  )
} 