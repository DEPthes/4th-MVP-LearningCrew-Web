import GroupListPage from '../../components/common/GroupListPage';
import sample from '../../assets/sample.png';
import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import GroupTypeTabs from '../../components/myGroup/GroupTypesTabs';
import type { GroupType } from '../../components/myGroup/GroupTypesTabs';
import CreateGroupButton from '../../components/myGroup/CreateGroupButton';
import styles from '../../styles/myGroup/myGroup.module.css';

const myGroups = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  image: sample,
  label: '같이 공부해요',
  count: '14/30',
  title: '스터디가 처음이신 분들 함께해요!',
  subtitle: '25.07.11 ~ 25.08.20',
  person: '@아무개',
  categories: ['언어', '개발, 프로그래밍'],
  isBookmarked: i % 3 === 0,
  type: (i % 3 === 0 ? 'joined' : i % 3 === 1 ? 'hosted' : 'applied') as GroupType,
}));

export default function MyGroup() {
  const [list, setList] = useState(myGroups);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rawQ = params.get('q') ?? '';
  const q = rawQ.trim().toLowerCase();
  const type = (params.get('type') as GroupType) || 'joined';

  const handleTypeChange = (next: GroupType) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set('type', next);
    navigate({ pathname, search: `?${nextParams.toString()}` });
  };

  const filtered = useMemo(() => {
    return list.filter(item => {
      const byType = item.type === type;
      const bySearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.categories?.some(c => c.toLowerCase().includes(q));
      return byType && bySearch;
    });
  }, [list, q, type]);

  const handleBookmarkClick = (id: number) => {
    setList(prev =>
      prev.map(g =>
        g.id === id ? { ...g, isBookmarked: !g.isBookmarked } : g
      )
    );
  };

  const title = rawQ.trim()
    ? <span className={styles.searchTitle}>{`'${rawQ.trim()}' 검색 결과`}</span>
    : <span className={styles.defaultTitle}>내 그룹 리스트</span>;

  return (
    <div>
      <GroupListPage
        title={title}
        groupList={filtered}
        showSort
        onBookmarkClick={handleBookmarkClick}
        headerBelow={
          <div className={styles.headerBelowRow}>
            <GroupTypeTabs value={type} onChange={handleTypeChange} />
            {type === 'hosted' && (
              <div className={styles.createBtnWrapper}>
                <CreateGroupButton to="/mygroup/create" />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}