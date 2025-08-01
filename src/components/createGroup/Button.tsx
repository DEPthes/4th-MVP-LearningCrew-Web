import type { UseFormHandleSubmit } from "react-hook-form";
import styles from "../../styles/createGroup/Button.module.css";

interface ButtonProps {
  handleSubmit: ReturnType<UseFormHandleSubmit<any>>;
}

export const Button = ({ handleSubmit }: ButtonProps) => {
  return (
    <button className={styles.create__button} onClick={handleSubmit}>
      개설
    </button>
  );
};
