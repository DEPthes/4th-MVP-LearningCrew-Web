import { useState } from "react";
import styles from "../../styles/createGroup/CategoryComponentStyle.module.css";
import type { UseFormSetValue } from "react-hook-form";

interface CategoryItem {
  id: number;
  image: string;
  category: string;
}

interface CategoryProps {
  name?: string;
  data: CategoryItem[];
  message?: string;
  errorMessage?: string;
  setValue?: UseFormSetValue<any>;
}

export const Category = ({ name, data, message, errorMessage, setValue }: CategoryProps) => {
  const [selects, setSelects] = useState<string[]>([]);
  const [etc, setEtc] = useState<string>("");

  //나중에 api 보고 id로 정렬한 다음 넣기, 기타가 포함되어 있을 경우 기타 대신 etc 넣기
  const handleCategorySelect = (value: string) => {
    const newSelects = selects.includes(value)
      ? selects.filter(item => item !== value)
      : [...selects, value];

    setSelects(newSelects);
    if (name && setValue) {
      const formattedSelects = newSelects.map(item => (item === "기타" ? (etc || "기타") : item));
      setValue(name, formattedSelects, { shouldValidate: true });
    }
  };


  const handleETCInput = (value: string) => {
    if (value.length > 20) {
      alert('키워드는 20자 이내로 입력해주세요.');
      return;
    }
    setEtc(value);
    if (name && setValue) {
      const formattedSelects = selects.map(item => (item === "기타" ? value : item));
      setValue(name, formattedSelects, { shouldValidate: true });
    }
  }

  return (
    <div className={styles.category__container}>
      {errorMessage ? <p className={styles.category__errormessage}>*{errorMessage}</p> : <p className={styles.category__message}>*{message}</p>}
      {data.map((value, index) => (
        <button
          key={index}
          onClick={() => handleCategorySelect(value.category)}
          className={
            selects.includes(value.category)
              ? styles["category__button--selected"]
              : styles["category__button--default"]
          }>
          {value.category}
        </button >
      ))}
      <button
        onClick={() => handleCategorySelect("기타")}
        className={
          selects.includes("기타")
            ? styles["category__button--selected"]
            : styles["category__button--default"]
        }>
        기타
      </button >
      {selects.includes("기타") ?
        <div>
          <p className={styles.etc__title}>기타</p>
          <input
            type="text"
            onChange={(e) => handleETCInput(e.target.value)}
            value={etc}
            className={styles.etc__input}
            placeholder="스터디를 대표하는 키워드를 입력하세요."
            maxLength={20}
          />
        </div>
        : <></>}
    </div>
  )
}