import styles from "../../styles/common/GroupTitle.module.css";
import type { ReactNode } from 'react';

type Props = {
  text:  string | ReactNode;
};

export default function GroupTitle({ text }: Props) {
  return <h2 className={styles.title}>{text}</h2>;
}