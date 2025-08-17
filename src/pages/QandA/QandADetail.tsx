import { useParams } from "react-router-dom";
import { PostDetail } from "../../components/common/PostDetail";
import styles from "../../styles/QandA/QandADetailPageStyle.module.css";
import { Comment } from "../../components/QandA/Comment"
import { getQandADetail } from "../../apis/studygroup/QandA";
import { useEffect, useState } from "react";
import { useGroupTab } from "../../hooks/GroupTabContext";

export const QandADetail = () => {
  const { qId } = useParams<{ qId: string }>();
  const { groupId } = useParams<{ groupId: string }>();
  const [qandADetail, setQandADetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentTab } = useGroupTab();

  useEffect(() => {
    setCurrentTab(`QandADetail:${qId}`);
  }, [setCurrentTab]);

  useEffect(() => {
    const fetchQandADetail = async () => {
      try {
        if (groupId && qId) {
          const response = await getQandADetail({ groupId: groupId, qnaId: qId });
          setQandADetail(response);
          console.log(response);
          setLoading(false);
        }
      } catch (error) {
        console.error("질문 상세 정보를 가져오는데 실패했습니다:", error);
        setLoading(false);
      }
    };
    fetchQandADetail();
  }, [qId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.qanda__container}>
      <PostDetail data={qandADetail} />
      <Comment />
    </div>
  );
}