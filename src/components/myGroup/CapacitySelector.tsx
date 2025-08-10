import  type { ReactNode } from 'react';
import styles from '../../styles/myGroup/CapacitySelector.module.css';

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number; // 기본 2
  max?: number; // 기본 20
  disabled?: boolean;
  label?: string;                              // 상단 라벨 (기본: 모집인원)
  pillFormatter?: (v: number) => ReactNode;    // pill 안의 문구
  help?: ReactNode[];                          // 하단 도움말 
};

export default function CapacitySelector({
  value,
  onChange,
  min = 2,
  max = 20,
  disabled = false,
  label = '모집인원',
  pillFormatter,
  help,
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const prev = Math.max(min, value - 1);
  const next = Math.min(max, value + 1);

  const defaultPill = (
    <span className={styles.pillText}>
      최대 <b>{value}</b> 명
    </span>
  );

  const defaultHelp = [
    '*모집인원을 작성해 주세요.',
    `*최대 ${max}명`,
  ];

  return (
    <div className={styles.wrap} aria-label={`${label} 선택`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controlCol}>
        <button
          type="button"
          className={styles.arrow}
          onClick={dec}
          disabled={disabled || value <= min}
          aria-label={`${label} 줄이기`}
        >
          ▲
        </button>

        <div className={`${styles.sideNumber} ${value <= min ? styles.dim : ''}`}>
          {prev}
        </div>

        <button type="button" className={styles.pill} disabled aria-disabled>
          {pillFormatter ? pillFormatter(value) : defaultPill}
        </button>

        <div className={`${styles.sideNumber} ${value >= max ? styles.dim : ''}`}>
          {next}
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={inc}
          disabled={disabled || value >= max}
          aria-label={`${label} 늘리기`}
        >
          ▼
        </button>
      </div>

      <div className={styles.help}>
        {(help ?? defaultHelp).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
