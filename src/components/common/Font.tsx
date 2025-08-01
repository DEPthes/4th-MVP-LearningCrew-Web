
import { useState } from "react";
import styles from "../../styles/common/Font.module.css";
import ArrowDown from "../../assets/DownArrow.svg";
import ArrowUp from "../../assets/UpArrow.svg";
import Check from "../../assets/Check.svg";

interface FontProps {
  handleFontSizeChange: (fontSize: string) => void;
  currentFontSize: string;
}

export const Font = ({ handleFontSizeChange, currentFontSize }: FontProps) => {
  const fontSize = ['16', '18', '20', '24', '32', '36'];
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenClick = () => {
    setIsOpen(!isOpen);
  }

  const handleFontSizeSelect = (value: string) => {
    handleFontSizeChange(value);
    setIsOpen(false);
  }

  return (
    <div className={styles.toolbar}>
      <div onClick={handleOpenClick} className={styles.top}>
        <div className={styles.top__current}><p>{currentFontSize.slice(0, 2)}</p></div>
        {isOpen ?
          <div className={styles.top__arrow}><img src={ArrowUp} /></div>
          : <div className={styles.top__arrow}><img src={ArrowDown} /></div>}
      </div>
      {isOpen && (
        <div className={styles.bottom}>
          <div className={styles.bottom__current}>
            <img src={Check} />
            <p>{currentFontSize.slice(0, 2)}</p>
          </div>
          <div className={styles.bottom__list}>
            {fontSize.map((value) => (
              <div
                key={value}
                onClick={() => handleFontSizeSelect(value)}
                className={styles.bottom__item}
                style={{
                  backgroundColor: currentFontSize === `${value}px` ? 'var(--Gray2)' : 'var(--Gray4)',
                  color: currentFontSize === `${value}px` ? 'var(--MainColor1)' : 'var(--Gray1)'
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}