import styles from "../../styles/createGroup/ContainerComponentStyle.module.css";

interface ContainerProps {
  title: string;
  children: React.ReactNode;
}

export const Container = ({ title, children }: ContainerProps) => {
  return (
    <div className={styles.container__container}>
      <p className={styles.container__title}>{title}</p>
      {children}
    </div>
  )
}