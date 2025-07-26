import styles from "../../../styles/signUp/IdInputGroup.module.css"
import { use, useState } from "react"

type IdInputGroupProps = {
  label: string
  placeholder: string
  message: string
  type: string
}

export default function IdInputGroup({ label, placeholder, message, type }: IdInputGroupProps) {

    const [isChecked, setIsChecked] = useState(false)
    const handleCheck = () => {
        setIsChecked(true)
    }

    return(
        <>
            <div className={styles.div__container}>
                <label className={styles.label}>{label}</label>
                <div className={styles.input__container}>
                <input type={type} placeholder={placeholder} className={styles.input}></input>
                <button className={`${styles.dup__button} ${isChecked ? styles.active : ""}`}
            onClick={handleCheck}>중복 확인</button>
                </div>
                <div className= {styles.input__require}>{message}</div>
            </div>
        </>
    )
}