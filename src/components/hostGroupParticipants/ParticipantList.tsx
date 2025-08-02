import styles from "../../styles/hostGroupParticipants/ParticipantList.module.css"

export default function ParticipantList() {
    return(
        <>
        <div className={styles.list__wrapper}>
            <div className={styles.th__wrapper}>
                <div className={styles.th__nickname}>합격하고 싶은 사람</div>
                <div className={styles.th__gender}>남</div>
                <div className={styles.th__date}>2025.07.14</div>
            </div>
            <button className={styles.button}>삭제</button>
        </div>
        </>
    )
}