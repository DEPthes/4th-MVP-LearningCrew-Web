import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GroupListPage from "../../components/common/GroupListPage";
import CategoryTabs from "../../components/home/CategoryTabs";
import styles from "../../styles/home/Home.module.css";
import {
  fetchStudyGroups,
  type StudyGroupItem,
  fetchStudyGroup,
} from "../../apis/common/studyGroups";
import CATEGORY_NAME_TO_ID from "../../constants/categoryNameToId";
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

  const [params] = useSearchParams();
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim();

  const [sort, setSort] = useState<"최신순" | "오래된순" | "관련도순" | "가나다순">("최신순");

  const page = 0;
  const size = 12;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createdUrlsRef = useRef<string[]>([]);
  const requestIdRef = useRef(0);

  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    const myRequestId = ++requestIdRef.current;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const categoryId =
          selectedCategory === "전체"
            ? undefined
            : CATEGORY_NAME_TO_ID[selectedCategory];

        let sortKey: any = "created_at";
        let order: "asc" | "desc" | undefined = "desc";

        switch (sort) {
          case "최신순":
            sortKey = "created_at";
            order = "desc";
            break;
          case "오래된순":
            sortKey = "created_at";
            order = "asc";
            break;
          case "가나다순":
            sortKey = "alphabet";
            order = undefined;
            break;
          case "관련도순":
            if (q) {
              sortKey = "relative";
              order = undefined;
            } else {
              sortKey = "created_at";
              order = "desc";
            }
            break;
        }

        const res = await fetchStudyGroups({
          sort: sortKey,
          order,
          categoryId,
          searchKeyword: q || undefined,
          page,
          size,
        });

        if (!alive || requestIdRef.current !== myRequestId) return;

        const items: StudyGroupItem[] = Array.isArray(res?.content)
          ? res.content
          : Array.isArray(res)
          ? (res as any)
          : [];

        const skels = items.map(toCardSkeleton);
        setCards(skels);

        const loaded = await Promise.all(
          items.map(async (item, idx) => {
            const base = skels[idx];
            const uuid = item.groupImage?.uuid;
            const fileName = item.groupImage?.fileName;
            if (!uuid || !fileName) return base;

            try {
              const url = await getImage(uuid, fileName);
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
  }, [selectedCategory, q, sort, page, size]);

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
  };

  const handleCardClick = async (id: number) => {
    try {
      const detail = await fetchStudyGroup(id);
      const step = Number(detail.currentStep) || 1;
      navigate(`/group/${id}/step/${step}/MyGroupStudy`, { state: { group: detail } });
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "스터디 상세를 불러오지 못했어요.";
      alert(msg);
    }
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
      {errorMsg && <div className={styles.error}>불러오는데 실패했어요</div>}

      {!loading && !errorMsg && (
        <GroupListPage
          title={title}
          groupList={filtered}
          showSort
          onBookmarkClick={handleBookmarkClick}
          isGroup
          sort={sort}
          setSort={setSort}
          onCardClick={handleCardClick}
        />
      )}

      {!loading && !errorMsg && filtered.length === 0 && (
        <div className={styles.empty}>조건에 맞는 스터디가 없어요.</div>
      )}
    </div>
  );
};
