// import { nicknameConfirm } from '../../apis/login/login';
import GroupListPage from '../../components/common/GroupListPage';
import sample from '../../assets/sample.png';
import CategoryTabs from '../../components/home/CategoryTabs';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import styles from "../../styles/home/Home.module.css";

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  image: sample,
  label: '같이 공부해요',
  count: '14/30',
  title: '스터디가 처음이신 분들 함께해요!',
  subtitle: '25.07.11 ~ 25.08.20',
  person: '@아무개',
  categories: ['언어', '개발, 프로그래밍'],
  isBookmarked: false,
}));

export const Home = () => {
  const [groupList, setGroupList] = useState(dummyData);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const [params] = useSearchParams();
  const rawQ = params.get('q') ?? '';
  const q = rawQ.trim().toLowerCase();

  const handleBookmarkClick = (id: number) => {
    setGroupList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  // 필터링
  const filtered = useMemo(() => {
    return groupList.filter((item) => {
      const byCategory =
        selectedCategory === '전체' ||
        item.categories.includes(selectedCategory);

      const bySearch =
        q === '' ||
        item.label.toLowerCase().includes(q) ||
        item.categories.some((c) => c.toLowerCase().includes(q));

      return byCategory && bySearch;
    });
  }, [groupList, selectedCategory, q]);

  // 제목
  const title = rawQ.trim()
    ? <span className={styles.searchTitle}>{`'${rawQ.trim()}' 검색 결과`}</span>
    : <span>스터디 모집</span>;

  return (
    <div>
      <CategoryTabs
        selectedLabel={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <GroupListPage
        title={title}
        groupList={filtered}
        showSort={true}
        onBookmarkClick={handleBookmarkClick}
      />
    </div>
  );
};

  // const handleNicknameConfirm = async () => {
  //   try {
  //     const response = await nicknameConfirm("test");
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }