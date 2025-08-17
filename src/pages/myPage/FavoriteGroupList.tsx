import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [params] = useSearchParams();
  const rawQ = params.get('q') ?? '';
  const q = rawQ.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return dummyData;
    return dummyData.filter(item => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inLabel = item.label.toLowerCase().includes(q);
      const inTags = (item.tags ?? []).some(t => t.toLowerCase().includes(q));
      return inTitle || inLabel || inTags;
    });
  }, [q]);

  const title = rawQ.trim()
    ? `'${rawQ.trim()}' 검색 결과`
    : '찜 그룹 리스트';

  return (
    <GroupListPage
      title={title}
      groupList={filtered}
    />
  );
}
