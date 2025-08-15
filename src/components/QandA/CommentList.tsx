import { useEffect, useState } from "react";
import styles from "../../styles/QandA/Comment.module.css";
import { Sort } from "../common/Sort";
import { getFile, getImage } from "../../apis/common/File";

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

interface CommentListProps {
  comments?: DataProps[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  const [sort, setSort] = useState<string>("최신순");
  const [sortedComments, setSortedComments] = useState<DataProps[] | undefined>(comments);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>();

  useEffect(() => {
    if (!comments || !Array.isArray(comments)) {
      setSortedComments([]);
      return;
    }

    if (sort === "오래된순") {
      setSortedComments([...comments]);
    } else if (sort === "관련도순") {
      setSortedComments([...comments].sort((a, b) => a.content.localeCompare(b.content)));
    } else if (sort === "가나다순") {
      setSortedComments([...comments].sort((a, b) => a.createdBy.nickname.localeCompare(b.createdBy.nickname)));
    } else {
      setSortedComments([...comments].reverse());
    }
  }, [sort, comments]);

  useEffect(() => {
    const fetchImages = async () => {
      if (comments && Array.isArray(comments)) {
        const imageUrlMap: { [key: string]: string } = {};

        for (const comment of comments) {
          if (comment.createdBy.profileImage.uuid) {
            try {
              const response = await getImage(comment.createdBy.profileImage.uuid);
              setProfileImageUrl(response);
            } catch (error) {
              console.error(`프로필 이미지 로드 실패: ${comment.createdBy.profileImage.uuid}`, error);
            }
          }

          if (comment.attachedImages && comment.attachedImages.length > 0) {
            for (const image of comment.attachedImages) {
              try {
                const response = await getImage(image.uuid);
                imageUrlMap[image.uuid] = response;
              } catch (error) {
                console.error(`이미지 로드 실패: ${image.fileName}`, error);
              }
            }
          }
        }

        setImageUrls(imageUrlMap);
      }
    };

    fetchImages();
  }, [comments]);

  const handleFileDownload = async (file: FileProps) => {
    try {
      const response = await getFile(file.uuid);

      const link = document.createElement("a");
      link.href = response;
      link.download = file.fileName; // 저장될 파일 이름
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 정리
      window.URL.revokeObjectURL(response);
    } catch (error) {
      console.error(`파일 다운로드 실패: ${file.fileName}`, error);
    }
  };

  return (
    <div className={styles.comment__container}>
      <div className={styles.comment__header}>
        <p>댓글</p>
        <div className={styles.comment__sort}><Sort sort={sort} setSort={setSort} /></div>
      </div>
      <div className={styles.comment__content__container}>
        {comments && Array.isArray(comments) && comments.length > 0 ?
          (sortedComments && Array.isArray(sortedComments) ?
            sortedComments.map((comment, index) => (
              <div
                key={comment.id}
                className={styles.comment__content__each}
                style={{ borderBottom: index + 1 === sortedComments.length ? "none" : "2px solid var(--Gray4)" }}
              >
                <div className={styles.comment__content__each__header}>
                  {profileImageUrl ?
                    <>
                      <img src={profileImageUrl} />
                    </>
                    :
                    <div className={styles.comment__profile__none}>
                      <p className={styles.comment__profile__none__word}>{comment.createdBy.nickname.slice(0, 1)}</p>
                    </div>}
                  <p className={styles.comment__content__each__writer}>{comment.createdBy.nickname} 님</p>
                  <p className={styles.comment__content__each__date}>{comment.createdAt.slice(0, 10)} {comment.createdAt.slice(11, 16)}</p>
                </div>
                <div className={styles.comment__content__each__content}>
                  <p>{comment.content}</p>
                  <div className={styles.comment__imageList}>
                    {comment.attachedImages.length > 0 && comment.attachedImages.map((image) => (
                      <div key={image.uuid} className={styles.comment__imageItem}>
                        <img src={imageUrls[image.uuid] || image.uuid} alt={image.fileName} className={styles.comment__image} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.comment__fileList}>
                    {comment.attachedFiles.length > 0 && comment.attachedFiles.map((file) => (
                      <div key={file.uuid} className={styles.comment__fileItem}>
                        <button
                          onClick={() => handleFileDownload(file)}
                          className={styles.comment__fileButton}
                        >
                          {file.fileName}
                        </button>
                        <span className={styles.comment__fileSize}>
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )) :
            <div className={styles.comment__content__none}>
              <div className={styles.comment__none1}>댓글을 불러오는 중...</div>
            </div>
          ) :
          <div className={styles.comment__content__none}>
            <div className={styles.comment__none1}>아직 댓글이 없습니다</div>
            <div className={styles.comment__none2}>댓글을 남겨 보세요</div>
          </div>}
      </div>
    </div>
  )
} 