import styles from "../../styles/hostGroupParticipants/HostGroupParticipants.module.css";
import { useEffect, useMemo, useState } from "react";
import ApplicantRow from "../hostGroupApplicant/ApplicantList";
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

interface Props {
  groupId: number;
}

const fmt = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export default function HostGroupApplicant({ groupId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("participant");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<(Application | Member)[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const apiSort = useMemo(() => {
    return sort === "최신순" ? "createdAt,desc" : "createdAt,asc";
  }, [sort]);

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

  // 신청자 탭이 열려 있을 땐 10초마다 목록 자동 갱신 → 누군가 신규 신청하면 바로 보임
  useEffect(() => {
    if (activeTab !== "applicant") return;
    const id = setInterval(fetchList, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, apiSort, groupId]);

  const handleApprove = async (userId: number) => {
    try {
      setLoading(true);
      await approveApplication(groupId, userId);
      await fetchList();
    } catch (e: any) {
      alert(e?.message ?? "승인 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      setLoading(true);
      await rejectApplication(groupId, userId);
      await fetchList();
    } catch (e: any) {
      alert(e?.message ?? "거절 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: number) => {
    try {
      setLoading(true);
      await expelMember(groupId, userId);
      await fetchList();
    } catch (e: any) {
      alert(e?.message ?? "삭제 중 오류가 발생했어요.");
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
              <ApplicantRow
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
              <ApplicantRow
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