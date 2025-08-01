import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "../../styles/common/InputComponentStyle.module.css";

interface InputProps {
  holder: string;
  message: string;
  errorMessage?: string;
  additional?: string;
  inputWidth?: number;
  maxLength?: number;
  register?: UseFormRegisterReturn;
}

export const Input = ({ holder, message, errorMessage, additional, inputWidth, maxLength, register }: InputProps) => {
  return (
    <div className={styles.input__container}>
      <input
        placeholder={holder}
        width={inputWidth}
        className={styles.input__input}
        maxLength={maxLength}
        {...register}
      />
      {errorMessage ?
        <p className={styles.input__errormessage}>*{errorMessage}</p>
        : <p className={styles.input__message}>*{message}</p>}
      {additional ?
        <p className={styles.input__addimessage}>*{additional}</p>
        : <></>}
    </div>
  )
}