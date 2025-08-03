import styles from "../../styles/hostGroupApplicant/ApplicantList.module.css"

export default function ApplicantList() {
    return(
        <>
            <div className={styles.list__wrapper}>
            <div className={styles.th__wrapper}>
                <div className={styles.th__nickname}>합격하고 싶은 사람</div>
                <div className={styles.th__gender}>남</div>
                <div className={styles.th__date}>2025.07.14</div>
            </div>
            <div className={styles.button__container}>
            <button className={styles.approveButton}>승인</button>
            <button className={styles.rejectButton}>거절</button>
            </div>
        </div>
        </>
    )
}