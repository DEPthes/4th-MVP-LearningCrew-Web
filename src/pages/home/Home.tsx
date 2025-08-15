import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GroupListPage from "../../components/common/GroupListPage";
import CategoryTabs from "../../components/home/CategoryTabs";
import styles from "../../styles/home/Home.module.css";
import {
  fetchStudyGroups,
  type StudyGroupItem,
} from "../../apis/common/studyGroups";
import CATEGORY_NAME_TO_ID from "../../constants/categoryNameToId";
import { mapSort, type SortLabel } from "../../utils/mapSort";
import { getImage } from "../../apis/common/File";

type Card = {
  id: number;
  image: string;
  label: string;
  count: string;
  title: string;
  subtitle: string;
  person: string;
  categories?: string[];
  isBookmarked?: boolean;
  type?: "joined" | "hosted" | "applied";
};

const PLACEHOLDER = "/images/placeholder-group.png";

function toCardSkeleton(item: StudyGroupItem): Card {
  return {
    id: item.id,
    image: PLACEHOLDER,
    label: item.summary || "스터디 소개",
    count: `${item.memberCount}/${item.maxMembers}`,
    title: item.name,
    subtitle: `${item.startDate.slice(2).replaceAll("-", ".")} ~ ${item.endDate
      .slice(2)
      .replaceAll("-", ".")}`,
    person: `@${item.owner?.nickname ?? "알 수 없음"}`,
    categories: item.categories?.map((c) => c.name) ?? [],
    isBookmarked: !!item.dibs,
  };
}

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortLabel, setSortLabel] = useState<SortLabel>("최신순");

  const [params] = useSearchParams();
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim();

  const page = 0;
  const size = 12;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createdUrlsRef = useRef<string[]>([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let alive = true;
    const myRequestId = ++requestIdRef.current;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const categoryId = CATEGORY_NAME_TO_ID[selectedCategory];
        const { sort, order } = mapSort(sortLabel);

        // 목록 조회 
        const res = await fetchStudyGroups({
          sort,
          order,
          categoryId,
          searchKeyword: q || undefined,
          page,
          size,
        });

        if (!alive || requestIdRef.current !== myRequestId) return;

        const skels = res.content.map(toCardSkeleton);
        setCards(skels);

        // 이미지 조회 
        const loaded = await Promise.all(
          res.content.map(async (item, idx) => {
            const base = skels[idx];
            const uuid = item.groupImage?.uuid;
            if (!uuid) return base;

            try {
              const url = await getImage(uuid, item.groupImage?.fileName);
              if (url.startsWith("blob:")) {
                createdUrlsRef.current.push(url);
              }
              return { ...base, image: url };
            } catch {
              return base;
            }
          })
        );

        if (!alive || requestIdRef.current !== myRequestId) return;
        setCards(loaded);
      } catch (e: unknown) {
        if (!alive || requestIdRef.current !== myRequestId) return;
        const msg =
          e && typeof e === "object" && "message" in e
            ? String((e as any).message)
            : "목록을 불러오지 못했습니다.";
        setErrorMsg(msg);
      } finally {
        if (alive && requestIdRef.current === myRequestId) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
      createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      createdUrlsRef.current = [];
    };
  }, [selectedCategory, q, sortLabel, page, size]);

  const filtered = useMemo(() => {
    if (!q && selectedCategory === "전체") return cards;

    const lc = q.toLowerCase();
    return cards.filter((item) => {
      const byCategory =
        selectedCategory === "전체" ||
        (item.categories ?? []).includes(selectedCategory);
      const bySearch =
        lc === "" ||
        item.title.toLowerCase().includes(lc) ||
        item.label.toLowerCase().includes(lc) ||
        (item.categories ?? []).some((c) => c.toLowerCase().includes(lc));
      return byCategory && bySearch;
    });
  }, [cards, selectedCategory, q]);

  const title = rawQ.trim() ? (
    <span className={styles.searchTitle}>{`'${rawQ.trim()}' 검색 결과`}</span>
  ) : (
    <span>스터디 모집</span>
  );

  const handleBookmarkClick = (id: number) => {
    setCards((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isBookmarked: !v.isBookmarked } : v))
    );
    // 찜 토글 API 연동
  };

  return (
    <div>
      <CategoryTabs
        selectedLabel={selectedCategory}
        onSelect={(label) => {
          setSelectedCategory(label);
        }}
      />

      {loading && <div className={styles.loading}>불러오는 중...</div>}
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      {!loading && !errorMsg && (
        <GroupListPage
          title={title}
          groupList={filtered}
          showSort
          onBookmarkClick={handleBookmarkClick}
          isGroup
          sortLabel={sortLabel}
          onSortChange={(label) => setSortLabel(label as SortLabel)}
        />
      )}

      {!loading && !errorMsg && filtered.length === 0 && (
        <div className={styles.empty}>조건에 맞는 스터디가 없어요.</div>
      )}
    </div>
  );
};
