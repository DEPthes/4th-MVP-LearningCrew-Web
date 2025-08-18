import styles from '../../styles/common/GroupListPage.module.css';
import GroupCard from '../../components/common/GroupCard';
import GroupTitle from '../../components/common/GroupTitle';
import { Pagenation } from '../../components/common/Pagenation';
import { Sort } from '../../components/common/Sort';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentStep } from '../../hooks/CurrentStepContext';
import { fetchStudyGroups } from '../../apis/common/studyGroups';

interface GroupItem {
  id: number;
  image: string | null;
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  categories?: string[];
  isBookmarked?: boolean;
  type?: 'joined' | 'hosted' | 'applied';
  sort?: string;
  setSort?: (sort: string) => void;
}

interface GroupListPageProps {
  title: ReactNode;
  groupList: GroupItem[];
  showSort?: boolean;
  headerBelow?: ReactNode;
  headerButton?: ReactNode;
  onBookmarkClick?: (id: number) => void;
  isGroup?: boolean;
  loading?: boolean;
  errorMsg?: string;
  sortLabel?: string;
  onSortChange?: (label: string) => void;
  onCardClick?: (id: number) => void;
  totalPages?: number;
  currentPage?: number;
  number?: number;
  setNumber?: (page: number) => void;
  sort?: string;
  setSort?: (sort: string) => void;
}

export default function GroupListPage({
  title,
  groupList,
  showSort = true,
  headerBelow,
  headerButton,
  onBookmarkClick,
  isGroup = true,
  loading,
  errorMsg,
  totalPages,
  number,//currentPage
  setNumber,
  sort,
  setSort,
}: GroupListPageProps) {
  const navigate = useNavigate();
  const { setCurrentStep } = useCurrentStep();

  //임시
  const handleGroupClick = (groupId: number) => {
    const fetchCurrentStepId = async () => {
      try {
        if (groupId) {
          const response = await fetchStudyGroups({ page: 0, size: 1000 });
          const item = response.content.find(item => item.id === groupId);
          if (item) {
            navigate(`/group/${groupId}/step/${item.currentStep}/MyGroupStudy`);
            setCurrentStep(item.currentStep);
          }
        }
      } catch (error) {
        console.error('현재 스텝 아이디 조회 실패:', error);
      }
    };
    fetchCurrentStepId();
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <GroupTitle text={title} />
          <div>
            {showSort && (
              <div className={styles.sortWrapper}>
                <Sort sort={sort ?? "최신순"} setSort={setSort ?? (() => { })} isGroup={isGroup} />
              </div>
            )}
            {headerButton && (
              <div>{headerButton}</div>
            )}
          </div>
        </div>

        {headerBelow && (
          <div className={styles.headerBelow}>
            {headerBelow}
          </div>
        )}

        {groupList.length === 0 ? (
          loading ? (
            <div className={styles.empty}>로딩 중...</div>
          ) : (
            <div className={styles.empty}>{errorMsg ?? "검색 결과가 없어요."}</div>
          )
        ) : (
          <div className={styles.cardGrid}>
            {groupList.map(group => (
              <div onClick={() => handleGroupClick(group.id)} key={group.id}>
                <GroupCard
                  key={group.id}
                  {...group}
                  type={group.type}
                  onBookmarkClick={onBookmarkClick}
                />
              </div>
            ))}
          </div>
        )}

        {groupList.length > 0 && (
          <Pagenation
            currentPage={number || 1}
            totalPages={totalPages || 1}
            setCurrentPage={setNumber || (() => { })}
          />
        )}
      </div>
    </div>
  );
}
