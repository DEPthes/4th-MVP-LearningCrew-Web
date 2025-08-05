import styles from "../../styles/common/GroupTitle.module.css";

type Props = {
  text: string;
};

export default function GroupTitle({ text }: Props) {
  return <h2 className={styles.title}>{text}</h2>;
}