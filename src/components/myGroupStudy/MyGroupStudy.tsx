import styles from "../../styles/myGroupStudy/MyGroupStudy.module.css"

export default function MyGroupStudy({ title, content }: { title: string; content: string }) {
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.noteBox}>
                <h2 className={styles.noteTitle}>{title}</h2>
                <p className={styles.noteContent}>{content}</p>
            </div>
        </div>
        </>
    )
}