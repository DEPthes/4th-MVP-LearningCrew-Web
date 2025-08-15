// src/components/hostGroupApplicant/ApplicantList.tsx
import styles from "../../styles/hostGroupApplicant/ApplicantList.module.css";

export type RowMode = "applicant" | "participant";

export interface RowProps {
  mode: RowMode;
  nickname: string;
  gender?: string;
  dateLabel: string;
  onApprove?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  busy?: boolean;
}

export default function ApplicantList({
  mode,
  nickname,
  gender,
  dateLabel,
  onApprove,
  onReject,
  onRemove,
  busy,
}: RowProps) {
  return (
    <div className={styles.list__wrapper}>
      <div className={styles.th__wrapper}>
        <div className={styles.th__nickname}>{nickname}</div>
        <div className={styles.th__gender}>{gender ?? "-"}</div>
        <div className={styles.th__date}>{dateLabel}</div>
      </div>

      <div className={styles.button__container}>
        {mode === "applicant" ? (
          <>
            <button className={styles.approveButton} disabled={busy} onClick={onApprove}>
              승인
            </button>
            <button className={styles.rejectButton} disabled={busy} onClick={onReject}>
              거절
            </button>
          </>
        ) : (
          <button className={styles.rejectButton} disabled={busy} onClick={onRemove}>
            삭제
          </button>
        )}
      </div>
    </div>
  );
}