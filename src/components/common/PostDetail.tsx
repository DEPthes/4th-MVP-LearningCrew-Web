
import styles from "../../styles/common/PostDetail.module.css";

interface DataProps {
  id: number;
  title: string;
  writer: string;
  createdAt: string;
  content: string;
}
interface PostDetailProps {
  data?: DataProps;
}

export const PostDetail = ({ data }: PostDetailProps) => {
  if (!data?.id) {
    return <div className={styles.detail__container}>노트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.detail__container}>
      <div className={styles.detail__header}>
        <h1 className={styles.detail__title}>{data.title}</h1>
        <div className={styles.detail__info}>
          <span className={styles.detail__writer}>{data.writer}</span>
          <span className={styles.detail__date}>{data.createdAt}</span>
        </div>
      </div>
      <div
        className={styles.detail__content}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}