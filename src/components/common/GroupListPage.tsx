import styles from '../../styles/common/GroupListPage.module.css';
import GroupCard from '../../components/common/GroupCard';
import GroupTitle from '../../components/common/GroupTitle';
import { Pagenation } from '../../components/common/Pagenation';
import { Sort } from '../../components/common/Sort';
import { useState } from 'react';
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
}

export default function GroupListPage({
  title,
  groupList,
  showSort = true,
  onBookmarkClick,
  headerBelow,
  headerButton,
}: GroupListPageProps) {
  const [sort, setSort] = useState('최신순');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <GroupTitle text={title} />
          <div>
            {showSort && (
              <div className={styles.sortWrapper}>
                <Sort sort={sort} setSort={setSort} />
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