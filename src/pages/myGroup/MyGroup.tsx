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

const transformGroupData = async (apiData: GroupListResponse | AppliedGroupListResponse, type: GroupType): Promise<TransformedGroupData[]> => {
  if (type === 'applied') {
    const appliedData = apiData as AppliedGroupListResponse;
    const transformedData = await Promise.all(
      appliedData.content.map(async (item) => {
        let imageUrl = DefaultGroupImage;
        if (item.studyGroup.groupImage) {
          try {
            imageUrl = await getImage(item.studyGroup.groupImage.uuid);
          } catch (error) {
            console.error(`이미지 로드 실패: ${item.studyGroup.groupImage.uuid}`, error);
            imageUrl = DefaultGroupImage;
          }
        }
        return {
          id: item.studyGroup.id,
          image: imageUrl,
          label: item.studyGroup.summary,
          count: `${item.studyGroup.memberCount}/${item.studyGroup.maxMembers}`,
          title: item.studyGroup.name,
          subtitle: `${item.studyGroup.startDate} ~ ${item.studyGroup.endDate}`,
          person: `@${item.studyGroup.owner.nickname}`,
          categories: item.studyGroup.categories.map(cat => cat.name),
          isBookmarked: item.studyGroup.dibs,
          type: type,
          totalPages: appliedData.page.totalPages,
        };
      })
    );
    return transformedData;
  } else {
    const groupData = apiData as GroupListResponse;
    const transformedData = await Promise.all(
      groupData.content.map(async (group) => {
        let imageUrl = DefaultGroupImage;
        if (group.groupImage) {
          try {
            imageUrl = await getImage(group.groupImage.uuid);
          } catch (error) {
            console.error(`이미지 로드 실패: ${group.groupImage.uuid}`, error);
            imageUrl = DefaultGroupImage;
          }
        }
        return {
          id: group.id,
          image: imageUrl,
          label: group.summary,
          count: `${group.memberCount}/${group.maxMembers}`,
          title: group.name,
          subtitle: `${group.startDate} ~ ${group.endDate}`,
          person: `@${group.owner.nickname}`,
          categories: group.categories.map(cat => cat.name),
          isBookmarked: group.dibs,
          type: type,
          totalPages: groupData.page.totalPages,
        };
      })
    );
    return transformedData;
  }
};

export default function MyGroup() {
  const [list, setList] = useState<TransformedGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("최신순");

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rawQ = params.get('q') ?? '';
  const q = rawQ.trim().toLowerCase();
  const type = (params.get('type') as GroupType) || 'joined';

  useEffect(() => {
    const apiSort = sort === "오래된순" ? "created_at" : sort === "관련도순" ? "relative" : sort === "가나다순" ? "alphabet" : "created_at";
    const order = sort === "오래된순" ? "asc" : "desc";
    const page = currentPage - 1;
    const fetchGroups = async () => {
      try {
        setLoading(true);

        let response: GroupListResponse | AppliedGroupListResponse;
        switch (type) {
          case 'joined':
            response = await getJoinGroup({ sort: apiSort, order, page, searchKeyword: rawQ.trim() || undefined });
            break;
          case 'hosted':
            try {
              response = await getHostedGroup({ sort: apiSort, order, page, searchKeyword: rawQ.trim() || undefined });
              setIsLogin(true);
            } catch (err) {
              setIsLogin(false);
              response = {
                content: [],
                page: {
                  size: 0,
                  number: 0,
                  totalElements: 0,
                  totalPages: 0,
                },
              }
            }
            break;
          case 'applied':
            response = await getAppliedGroup({ sort: apiSort, order, page, searchKeyword: rawQ.trim() || undefined });
            break;
        }

        const transformedData = await transformGroupData(response, type);
        setList(transformedData);
      } catch (err) {
        console.error('그룹 목록 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [type, sort, currentPage, rawQ]);

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
        loading={loading}
        number={currentPage}
        setNumber={setCurrentPage}
        sort={sort}
        setSort={setSort}
        headerBelow={
          <div className={styles.headerBelowRow}>
            <GroupTypeTabs value={type} onChange={handleTypeChange} />
            {type === 'hosted' && isLogin && (
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
