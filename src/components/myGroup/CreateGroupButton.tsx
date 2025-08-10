import { Link } from 'react-router-dom';
import styles from "../../styles/myGroup/CreateGroupButton.module.css";
import { MdOutlineLibraryAdd } from "react-icons/md";

interface Props {
  to: string;
}

export default function CreateGroupButton({ to }: Props) {
  return (
    <Link to={to} className={styles.button}>
        <MdOutlineLibraryAdd />
      개설
    </Link>
  );
}