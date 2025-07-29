import styles from "../../styles/createGroup/SelectRangeComponentStyle.module.css";
import high from "../../assets/HighArrow.svg";
import down from "../../assets/DownArrow.svg";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

interface RangeProps {
  name?: string;
  messgae: string;
  errorMessage?: string;
  max: number;
  unit: string;
  setValue?: UseFormSetValue<any>;
}

export const SelectRange = ({ name, messgae, errorMessage, max, unit, setValue }: RangeProps) => {
  const [num, setNum] = useState<number>(3);

  const handleArrowUp = () => {
    if (num < max) setNum(num + 1);
    else setNum(2);
    if (name && setValue && num < max) setValue(name, num + 1, { shouldValidate: true });
    else if (name && setValue) setValue(name, 2, { shouldValidate: true });
  }

  const handleArrowDown = () => {
    if (num > 2) setNum(num - 1);
    else setNum(max);
    if (name && setValue && num > 2) setValue(name, num - 1, { shouldValidate: true });
    else if (name && setValue) setValue(name, max, { shouldValidate: true });
  }

  return (
    <div className={styles.picker__container}>
      <img src={high} onClick={handleArrowDown} className={styles.picker__arrow} />
      <div className={styles.picker__counter__container}>
        <p className={styles.picker__upnum}>{num == 2 ? max : num - 1}</p>
        <div className={styles.picker__counter}>
          <div>
            <span>최대</span>
            <p className={styles.picker__counter__num}>{num}</p>
            <span>{unit}</span>
          </div>
        </div>
        <p className={styles.picker__upnum}>{num == max ? 2 : num + 1}</p>
      </div>
      <img src={down} onClick={handleArrowUp} className={styles.picker__arrow} />
      <div className={styles.message__container}>
        <p>*{errorMessage ? errorMessage : messgae}</p>
        <p>*최대 {max}{unit}</p>
      </div>
    </div>
  )
}