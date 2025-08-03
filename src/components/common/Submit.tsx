import styles from '../../styles/common/Submit.module.css';

interface SubmitProps {
  isSubmitting?: boolean;
  onClick: () => void;
  canSubmit: boolean;
  text: string;
}

export const Submit = ({ isSubmitting, onClick, canSubmit, text }: SubmitProps) => {
  return (
    <div className={styles.submit__container}>
      <button
        type="button"
        onClick={onClick}
        className={styles.submit__button}
        style={{
          backgroundColor: isSubmitting || !canSubmit ? 'var(--Gray4)' : 'var(--MainColor2)',
          cursor: isSubmitting || !canSubmit ? 'not-allowed' : 'pointer',
        }}
        disabled={isSubmitting || !canSubmit}
      >
        {text}
      </button>
    </div>
  )
}