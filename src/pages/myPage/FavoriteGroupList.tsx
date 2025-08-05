import styles from '../../styles/myPage/FavoriteGroupList.module.css';
import GroupCard from '../../components/common/GroupCard';
import GroupTitle from '../../components/common/GroupTitle';
import {Pagenation} from '../../components/common/Pagenation';
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
}));

export default function FavoriteGroupList() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <GroupTitle text="찜 그룹 리스트" />
        <div className={styles.cardGrid}>
          {dummyData.map(group => (
            <GroupCard
              key={group.id}
              image={group.image}
              label={group.label}
              count={group.count}
              title={group.title}
              subtitle={group.subtitle}
              person={group.person}
              tags={group.tags}
            />
           
          ))}

        </div>
         <Pagenation />
      </div>
    </div>
  );
}
