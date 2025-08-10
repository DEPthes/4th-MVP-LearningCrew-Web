import styles from "../../styles/common/GroupTitle.module.css";
import type { ReactNode } from 'react';

type Props = {
  text:  string | ReactNode;
  color?: string;
};

export default function GroupTitle({ text, color  }: Props) {
  return <h2 className={styles.title} style={{ color }}>{text}</h2>;
}