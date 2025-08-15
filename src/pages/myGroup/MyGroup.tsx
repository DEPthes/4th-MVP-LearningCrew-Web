import GroupListPage from '../../components/common/GroupListPage';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import GroupTypeTabs from '../../components/myGroup/GroupTypesTabs';
import type { GroupType } from '../../components/myGroup/GroupTypesTabs';
import CreateGroupButton from '../../components/myGroup/CreateGroupButton';
import styles from '../../styles/myGroup/myGroup.module.css';
import DefaultGroupImage from '../../assets/DefaultGroup.svg';
import type { GroupListResponse, AppliedGroupListResponse, TransformedGroupData } from '../../types/group';
import { getJoinGroup, getHostedGroup, getAppliedGroup } from '../../apis/home/GroupList';
import { getImage } from '../../apis/common/File';

// API 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환
const transformGroupData = async (apiData: GroupListResponse | AppliedGroupListResponse, type: GroupType): Promise<TransformedGroupData[]> => {
  if (type === 'applied') {
    // getAppliedGroup 응답 형식 처리
    const appliedData = apiData as AppliedGroupListResponse;
    const transformedData = await Promise.all(
      appliedData.content.map(async (item) => {
        let imageUrl = DefaultGroupImage;

        // studyGroup.groupImage가 null이 아닌 경우 getImage로 실제 이미지 URL 가져오기
        if (item.studyGroup.groupImage) {
          try {
            imageUrl = await getImage(item.studyGroup.groupImage.uuid);
          } catch (error) {
            console.error(`이미지 로드 실패: ${item.studyGroup.groupImage.uuid}`, error);
            imageUrl = DefaultGroupImage; // 실패 시 기본 이미지 사용
          }
        }

        return {
          id: item.studyGroup.id,
          image: imageUrl,
          label: '같이 공부해요',
          count: `${item.studyGroup.memberCount}/${item.studyGroup.maxMembers}`,
          title: item.studyGroup.name,
          subtitle: `${item.studyGroup.startDate} ~ ${item.studyGroup.endDate}`,
          person: `@${item.studyGroup.owner.nickname}`,
          categories: item.studyGroup.categories.map(cat => cat.name),
          isBookmarked: item.studyGroup.dibs,
          type: type,
        };
      })
    );

    return transformedData;
  } else {
    // getJoinGroup, getHostedGroup 응답 형식 처리
    const groupData = apiData as GroupListResponse;
    const transformedData = await Promise.all(
      groupData.content.map(async (group) => {
        let imageUrl = DefaultGroupImage;

        // groupImage가 null이 아닌 경우 getImage로 실제 이미지 URL 가져오기
        if (group.groupImage) {
          try {
            imageUrl = await getImage(group.groupImage.uuid);
          } catch (error) {
            console.error(`이미지 로드 실패: ${group.groupImage.uuid}`, error);
            imageUrl = DefaultGroupImage; // 실패 시 기본 이미지 사용
          }
        }

        return {
          id: group.id,
          image: imageUrl,
          label: '같이 공부해요',
          count: `${group.memberCount}/${group.maxMembers}`,
          title: group.name,
          subtitle: `${group.startDate} ~ ${group.endDate}`,
          person: `@${group.owner.nickname}`,
          categories: group.categories.map(cat => cat.name),
          isBookmarked: group.dibs,
          type: type,
        };
      })
    );

    return transformedData;
  }
};

export default function MyGroup() {
  const [list, setList] = useState<TransformedGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rawQ = params.get('q') ?? '';
  const q = rawQ.trim().toLowerCase();
  const type = (params.get('type') as GroupType) || 'joined';

  // 그룹 타입에 따라 API 호출
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: GroupListResponse | AppliedGroupListResponse;
        switch (type) {
          case 'joined':
            response = await getJoinGroup();
            break;
          case 'hosted':
            response = await getHostedGroup();
            break;
          case 'applied':
            response = await getAppliedGroup();
            break;
        }

        const transformedData = await transformGroupData(response, type);
        setList(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '그룹 목록을 불러오는데 실패했습니다.');
        console.error('그룹 목록 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [type]);

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

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