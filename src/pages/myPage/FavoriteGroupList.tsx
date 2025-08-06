import GroupListPage from '../../components/common/GroupListPage';
import sample from '../../assets/sample.png';

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  image: sample,
  label: '같이 공부해요',
  count: '14/30',
  title: '스터디가 처음이신 분들 함께해요!',
  subtitle: '25.07.11 ~ 25.08.20',
  person: '@아무개',
  tags: ['IT', '안드로이드', '프론트'],
  isBookmarked: true,
}));

export default function FavoriteGroupList() {
  return <GroupListPage title="찜 그룹 리스트" groupList={dummyData} />;
}