import { nicknameConfirm } from '../../apis/login/login';
import GroupListPage from '../../components/common/GroupListPage';
import sample from '../../assets/sample.png';
import CategoryTabs from '../../components/home/CategoryTabs';
import { useState } from 'react';

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  image: sample,
  label: '같이 공부해요',
  count: '14/30',
  title: '스터디가 처음이신 분들 함께해요!',
  subtitle: '25.07.11 ~ 25.08.20',
  person: '@아무개',
  tags: ['IT', '안드로이드', '프론트'],
  isBookmarked: false,
}));

export const Home = () => {
  const [groupList, setGroupList] = useState(dummyData);

  const handleBookmarkClick = (id: number) => {
    setGroupList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleNicknameConfirm = async () => {
    try {
      const response = await nicknameConfirm("test");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  return( 
    <div>
      <CategoryTabs />
      <GroupListPage title="스터디 모집" groupList={groupList} showSort={true} onBookmarkClick={handleBookmarkClick} />
    </div>
  );
}