import type { UseFormHandleSubmit, SubmitHandler } from "react-hook-form";
import styles from "../../styles/createGroup/Button.module.css";
import { PostCreateGroup } from "../../apis/creatGroup/createGroup";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  handleSubmit: UseFormHandleSubmit<any>;
}

export const Button = ({ handleSubmit }: ButtonProps) => {
  const navigate = useNavigate();
  const handleFormSubmit: SubmitHandler<any> = async (formData) => {
    console.log(formData);
    try {
      const response = await PostCreateGroup(formData);
      alert("스터디가 개설되었습니다.");
      navigate(`/`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      className={styles.create__button}
      onClick={handleSubmit(handleFormSubmit)}
    >
      개설
    </button>
  );
};
