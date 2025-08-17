// src/components/hostGroupParticipants/HostGroupParticipants.tsx
import styles from "../../styles/hostGroupParticipants/HostGroupParticipants.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantRow from "./ParticipantList";
import { Sort } from "../common/Sort";
import { Pagenation } from "../common/Pagenation";

import {
  getGroupApplications,
  approveApplication,
  rejectApplication,
} from "../../apis/Group/StudyGroupApplication";
import type { Application } from "../../apis/Group/StudyGroupApplication";

import { getGroupMembers, expelMember } from "../../apis/Group/Members";
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

// 영어 성별 → 한글
const displayGender = (gender?: string) => {
  if (!gender) return "-";
  const g = String(gender).toUpperCase();
  if (g === "MALE" || g === "남") return "남";
  if (g === "FEMAIL" || g === "FEMALE" || g === "여") return "여"; // FEMAIL 타이포까지 대응
  return "기타";
};

interface Props {
  groupId?: number; // URL 또는 prop
}

export default function HostGroupParticipants({ groupId: propId }: Props) {
  const { groupId: gid } = useParams<{ groupId: string }>();
  const groupId = propId ?? Number(gid);

  const [activeTab, setActiveTab] = useState<Tab>("applicant");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<(Application | Member)[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
  }, [activeTab, currentPage, sort, groupId, isRefreshing]);

  /** ✅ 현재 목록에서 특정 userId 제거(옵티미스틱) */
  const removeRowByUserId = (uid: number) => {
    setRows(prev =>
      prev.filter((r: any) => {
        const u = r?.user?.id ?? r?.applicant?.id ?? r?.id;
        return u !== uid;
      })
    );
  };

  /** ✅ 승인: 즉시 제거, 이미 처리된 400/404/409는 성공 간주(다시 안 보임) */
  const handleApprove = async (userId: number) => {
    setIsRefreshing(!isRefreshing);
    removeRowByUserId(userId); // 먼저 화면에서 삭제
    try {
      await approveApplication(groupId, userId);
    } catch (e: any) {
      const s = e?.response?.status;
      if (s === 400 || s === 404 || s === 409) return; // 이미 처리됨 → 그대로 유지
      await fetchList(); // 진짜 실패만 복구
      alert(e?.response?.data?.message || e?.message || "승인 중 오류가 발생했어요.");
    }
  };

  /** ✅ 거절: 즉시 제거, 이미 처리된 400/404/409는 성공 간주 */
  const handleReject = async (userId: number) => {
    setIsRefreshing(!isRefreshing);
    removeRowByUserId(userId);
    try {
      await rejectApplication(groupId, userId);
    } catch (e: any) {
      const s = e?.response?.status;
      if (s === 400 || s === 404 || s === 409) return;
      await fetchList();
      alert(e?.response?.data?.message || e?.message || "거절 중 오류가 발생했어요.");
    }
  };

  /** ✅ 참여자 탭 삭제(추방): 즉시 제거, 실패 시 복구 */
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
            if (a.state === "PENDING") {
              return (
                <ParticipantRow
                  key={a.user.id}                                    // ✅ user.id로 고정
                  mode="applicant"
                  nickname={a.user.nickname}
                  gender={displayGender(a.user.gender)}              // ✅ 남/여
                  dateLabel={fmt(a.createdAt)}
                  onApprove={() => handleApprove(a.user.id)}         // ✅ 즉시 제거
                  onReject={() => handleReject(a.user.id)}           // ✅ 즉시 제거
                  busy={loading}
                />
              );
            }
          } else {
            const m = item as Member;
            return (
              <ParticipantRow
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