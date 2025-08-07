import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import styles from "../../styles/signUp/BirthCalendar.module.css"
import ArrowLeft from "../../assets/arrow_left.svg"
import ArrowRight from "../../assets/arrow_right.svg"
import { useState } from "react"

type BirthCalendarProps = {
  value: Date | null
  onChange: (date: Date) => void
}

export default function BirthCalendar({ value, onChange }: BirthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>생년월일</label>
      <div className={styles.input__require}>*생년월일을 입력해주세요</div>
      <Calendar
        onChange={(value) => onChange(value as Date)}
        value={value}
        locale="ko-KR"
        calendarType="gregory"
        formatDay={(locale, date) => String(date.getDate())}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()
        }
        formatMonthYear={(locale, date) =>
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`
        }
        prevLabel={<img src={ArrowLeft} alt="이전달" style={{ width: "24px", height: "24px" }} />}
        nextLabel={<img src={ArrowRight} alt="다음달" style={{ width: "24px", height: "24px" }} />}
        prev2Label={null}
        next2Label={null}
        className={styles.calendar}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setCurrentMonth(activeStartDate)
        }}
        tileClassName={({ date, view }) => {
          const isNotThisMonth =
            view === 'month' && date.getMonth() !== currentMonth.getMonth();
          return `${styles.tile} ${isNotThisMonth ? styles.notCurrentMonth : ''}`;
        }}
      />
    </div>
  )
}