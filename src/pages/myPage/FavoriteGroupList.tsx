import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GroupListPage from "../../components/common/GroupListPage";
import { fetchStudyGroups, type StudyGroupItem } from "../../apis/common/studyGroups";
import { getImage } from "../../apis/common/File";
import { postBookmark } from "../../apis/common/Bookmark";

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
    isBookmarked: true, 
  };
}

export default function FavoriteGroupList() {
  const [params] = useSearchParams();
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim();

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

        const res = await fetchStudyGroups({
          page: 0,
          size: 50,
          sort: "createdAt",
          order: "desc",
          searchKeyword: q || undefined,
        });

        const items: StudyGroupItem[] = (res?.content ?? []).filter((g) => g.dibs === true);

        if (!alive || requestIdRef.current !== myRequestId) return;

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
            : "즐겨찾기 목록을 불러오지 못했습니다.";
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

  }, [q]);

  const filtered = useMemo(() => {
    if (!q) return cards;
    const lc = q.toLowerCase();
    return cards.filter((item) => {
      const bySearch =
        item.title.toLowerCase().includes(lc) ||
        item.label.toLowerCase().includes(lc) ||
        (item.categories ?? []).some((c) => c.toLowerCase().includes(lc));
      return bySearch;
    });
  }, [cards, q]);

  const handleToggleBookmark = async (groupId: number) => {
    const next = await postBookmark(String(groupId)); 
    if (!next) {
      setCards((prev) => prev.filter((v) => v.id !== groupId));
    }
  };

  return (
    <GroupListPage
      title={rawQ.trim() ? `'${rawQ.trim()}' 검색 결과` : "찜 그룹 리스트"}
      groupList={filtered}
      loading={loading}
      error={errorMsg ?? undefined}
      // GroupListPage가 지원하면 주석 해제
      // onToggleBookmark={handleToggleBookmark}
    />
  );
}
