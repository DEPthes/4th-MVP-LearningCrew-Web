import styles from '../../styles/common/GroupListPage.module.css';
import GroupCard from '../../components/common/GroupCard';
import GroupTitle from '../../components/common/GroupTitle';
import { Pagenation } from '../../components/common/Pagenation';
import { Sort } from '../../components/common/Sort';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface GroupItem {
  id: number;
  image: string;
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  categories?: string[];
  isBookmarked?: boolean;
  type?: 'joined' | 'hosted' | 'applied';
}

interface GroupListPageProps {
  title: ReactNode;
  groupList: GroupItem[];
  showSort?: boolean;
  onBookmarkClick?: (id: number) => void;
  headerBelow?: ReactNode;
  headerButton?: ReactNode;
  isGroup?: boolean;
  sortLabel?: string;
  onSortChange?: (label: string) => void;
  onCardClick?: (id: number) => void;
}

export default function GroupListPage({
  title,
  groupList,
  showSort = true,
  onBookmarkClick,
  headerBelow,
  headerButton,
  isGroup = false,
  sortLabel = "최신순",
  onSortChange,
  onCardClick,
}: GroupListPageProps) {
  const [sort, setSort] = useState(sortLabel);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSort(sortLabel);
  }, [sortLabel]);

  const handleSetSort = (next: string) => {
    setSort(next);
    onSortChange?.(next);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <GroupTitle text={title} />
          <div>
            {showSort && (
              <div className={styles.sortWrapper}>
                <Sort sort={sort} setSort={handleSetSort} isGroup={isGroup} />
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
          <div className={styles.empty}>검색 결과가 없어요.</div>
        ) : (
          <div className={styles.cardGrid}>
            {groupList.map(group => (
              <GroupCard
                key={group.id}
                {...group}
                type={group.type}
                onBookmarkClick={() => onBookmarkClick?.(group.id)}
                onClick={() => onCardClick?.(group.id)}   
              />
            ))}
          </div>
        )}

        {groupList.length > 0 && (
          <Pagenation
            currentPage={currentPage}
            totalPages={1}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
