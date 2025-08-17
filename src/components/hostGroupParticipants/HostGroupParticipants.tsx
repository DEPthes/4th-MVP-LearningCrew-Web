// src/components/hostGroupParticipants/HostGroupParticipants.tsx
import styles from "../../styles/hostGroupParticipants/HostGroupParticipants.module.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantList from "./ParticipantList";
import { Sort } from "../common/Sort";
import { Pagenation } from "../common/Pagenation";

import {
  getGroupApplications,
  approveApplication,
  rejectApplication,
} from "../../apis/Group/StudyGroupApplication";
import type { Application } from "../../apis/Group/StudyGroupApplication";

import {
  getGroupMembers,
  expelMember,
} from "../../apis/Group/Members";
import type { Member } from "../../apis/Group/Members";

type Tab = "participant" | "applicant";

const fmt = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

interface Props {
  groupId?: number; // URL 또는 prop
}

export default function HostGroupParticipants({ groupId: propId }: Props) {
  const { groupId: gid } = useParams<{ groupId: string }>();
  const groupId = propId ?? Number(gid);

  const [activeTab, setActiveTab] = useState<Tab>("participant");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<(Application | Member)[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const apiSort = useMemo(
    () => (sort === "최신순" ? "createdAt,desc" : "createdAt,asc"),
    [sort]
  );

  const fetchList = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      if (activeTab === "applicant") {
        const data = await getGroupApplications(groupId, { page, size: pageSize, sort: apiSort });
        setRows(data.content);
        setTotalPages(data.page.totalPages || 1);
      } else {
        const data = await getGroupMembers(groupId, { page, size: pageSize, sort: apiSort });
        setRows(data.content);
        setTotalPages(data.page.totalPages || 1);
      }
    } catch {
      setRows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, apiSort, groupId]);

  // 신청자 탭일 때 10초마다 자동 갱신
  useEffect(() => {
    if (activeTab !== "applicant") return;
    const id = setInterval(fetchList, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, apiSort, groupId]);

  /** ✅ 공통: 현재 rows에서 특정 유저 제거(옵티미스틱) */
  const removeRowByUserId = (uid: number) => {
    setRows(prev =>
      prev.filter((r) => {
        const u = (r as any)?.user?.id;
        return u !== uid;
      })
    );
  };

  const refetchCurrent = async () => {
    await fetchList();
  };

  // HostGroupParticipants.tsx 안에서 이 두 함수만 교체

/** ✅ 승인: 신청자 목록에서 즉시 제거(옵티미스틱) */
const handleApprove = async (userId: number) => {
  try {
    setLoading(true);
    await approveApplication(groupId, userId);

    // 1) 화면에서 즉시 제거 (신청자 탭에서 사라짐)
    setRows(prev =>
      prev.filter(r => (r as any)?.user?.id !== userId)
    );

    // 2) (선택) 최신 상태 보정: 현재 탭이 신청자면 재조회
    if (activeTab === "applicant") {
      await fetchList();
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "승인 중 오류가 발생했어요.";
    alert(msg);
  } finally {
    setLoading(false);
  }
};

/** ✅ 거절: 신청자 목록에서 즉시 제거(옵티미스틱) */
const handleReject = async (userId: number) => {
  try {
    setLoading(true);
    await rejectApplication(groupId, userId);

    // 1) 화면에서 즉시 제거
    setRows(prev =>
      prev.filter(r => (r as any)?.user?.id !== userId)
    );

    // 2) (선택) 보정용 재조회
    if (activeTab === "applicant") {
      await fetchList();
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "거절 중 오류가 발생했어요.";
    alert(msg);
  } finally {
    setLoading(false);
  }
};

  /** ✅ 삭제: 참여자 목록에서 제거 → 현재 탭 재조회 */
  const handleRemove = async (userId: number) => {
    try {
      setLoading(true);
      await expelMember(groupId, userId);
      removeRowByUserId(userId);          // 옵티미스틱 제거
      await refetchCurrent();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "삭제 중 오류가 발생했어요.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.button__container}>
          <button
            className={`${styles.tab} ${activeTab === "participant" ? styles.tab__active : ""}`}
            onClick={() => { setCurrentPage(1); setActiveTab("participant"); }}
          >
            <span className={`${styles.dot} ${activeTab === "participant" ? styles.dot__active : ""}`} />
            참여자
          </button>

          <button
            className={`${styles.tab} ${activeTab === "applicant" ? styles.tab__active : ""}`}
            onClick={() => { setCurrentPage(1); setActiveTab("applicant"); }}
          >
            <span className={`${styles.dot} ${activeTab === "applicant" ? styles.dot__active : ""}`} />
            신청자
          </button>
        </div>
        <Sort sort={sort} setSort={setSort} />
      </div>

      <div className={styles.list__wrapper}>
        <div className={styles.list__header}>
          <div className={styles.header__th__nickname}>닉네임</div>
          <div className={styles.header__th__gender}>성별</div>
          <div className={styles.header__th__date}>
            {activeTab === "applicant" ? "신청일자" : "가입일자"}
          </div>
        </div>
      </div>

      {loading && <div className={styles.loading}>불러오는 중...</div>}
      {!loading && rows.length === 0 && <div className={styles.empty}>목록이 없습니다.</div>}

      {!loading &&
        rows.map((item, idx) => {
          if (activeTab === "applicant") {
            const a = item as Application;
            return (
              <ParticipantList
                key={`${a.user.id}-${idx}`}
                mode="applicant"
                nickname={a.user.nickname}
                gender={a.user.gender}
                dateLabel={fmt(a.createdAt)}
                onApprove={() => handleApprove(a.user.id)}
                onReject={() => handleReject(a.user.id)}
                busy={loading}
              />
            );
          } else {
            const m = item as Member;
            return (
              <ParticipantList
                key={`${m.user.id}-${idx}`}
                mode="participant"
                nickname={m.user.nickname}
                gender={m.user.gender}
                dateLabel={fmt(m.createdAt)}
                onRemove={() => handleRemove(m.user.id)}
                busy={loading}
              />
            );
          }
        })}

      <div>
        <Pagenation
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}