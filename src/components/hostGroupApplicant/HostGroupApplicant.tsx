import styles from "../../styles/hostGroupParticipants/HostGroupParticipants.module.css";
import { useEffect, useState } from "react";
import ApplicantRow from "../hostGroupApplicant/ApplicantList";
import { Sort } from "../common/Sort";
import { Pagenation } from "../common/Pagenation";

import {
  getGroupApplications,
} from "../../apis/Group/StudyGroupApplication";
import type { Application } from "../../apis/Group/StudyGroupApplication";

import { getGroupMembers, expelMember } from "../../apis/Group/Members";
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

const displayGender = (gender?: string) => {
  if (!gender) return "-";
  const g = String(gender).toUpperCase();
  if (g === "MALE" || g === "남") return "남";
  if (g === "FEMALE" || g === "여") return "여";
  return "기타";
};

export default function HostGroupApplicant({ groupId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("applicant");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<(Application | Member)[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchList = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const order = sort === "최신순" ? "desc" : "asc";
      const apiSort = sort === "최신순" || sort === "오래된순" ? "created_at" : "alphabet";
      if (activeTab === "applicant") {
        const data = await getGroupApplications({ groupId, page, size: 10, sort: apiSort, order });
        setRows(data.content);
        setTotalPages(data.page.totalPages || 1);
      } else {
        const data = await getGroupMembers({ groupId, page, size: 10, sort: apiSort, order });
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
  }, [activeTab, currentPage, sort, groupId]);

  useEffect(() => {
    if (activeTab !== "applicant") return;
    const id = setInterval(fetchList, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, sort, groupId]);

  const removeRowByUserId = (uid: number) => {
    setRows(prev => prev.filter((r: any) => (r?.user?.id ?? r?.applicant?.id ?? r?.id) !== uid));
  };

  const handleApprove = async (userId: number) => {
    removeRowByUserId(userId);
    try {
      console.log("approveApplication");
    } catch (e: any) {
      const s = e?.response?.status;
      if (s === 400 || s === 404 || s === 409) return;
      await fetchList();
      alert(e?.response?.data?.message || e?.message || "승인 중 오류가 발생했어요.");
    }
  };

  const handleReject = async (userId: number) => {
    removeRowByUserId(userId);
    try {
    } catch (e: any) {
      const s = e?.response?.status;
      if (s === 400 || s === 404 || s === 409) return;
      await fetchList();
      alert(e?.response?.data?.message || e?.message || "거절 중 오류가 발생했어요.");
    }
  };

  const handleRemove = async (userId: number) => {
    removeRowByUserId(userId);
    try {
      await expelMember(groupId, userId);
    } catch (e: any) {
      await fetchList();
      alert(e?.response?.data?.message || e?.message || "삭제 중 오류가 발생했어요.");
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
        rows.map((item) => {
          if (activeTab === "applicant") {
            const a = item as Application;
            return (
              <ApplicantRow
                key={a.user.id}                         // ✅ user.id
                mode="applicant"
                nickname={a.user.nickname}
                gender={displayGender(a.user.gender)}   // ✅ 남/여
                dateLabel={fmt(a.createdAt)}
                onApprove={() => handleApprove(a.user.id)} // ✅ 즉시 제거
                onReject={() => handleReject(a.user.id)}   // ✅ 즉시 제거
                busy={loading}
              />
            );
          } else {
            const m = item as Member;
            return (
              <ApplicantRow
                key={m.user.id}
                mode="participant"
                nickname={m.user.nickname}
                gender={displayGender(m.user.gender)}
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