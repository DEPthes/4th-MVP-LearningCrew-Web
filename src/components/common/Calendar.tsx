import { useState, useEffect } from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../styles/common/CalendarComponentStyle.module.css';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarProps {
  message?: string;
  errorMessage?: string;
  name?: { start: string; end: string };
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
}

export const Calendar = ({ message, errorMessage, name, setValue, watch }: CalendarProps) => {
  const [value, setValueState] = useState<Value>(null);

  // 현재 폼 값들을 감시
  const startDate = watch && name?.start ? watch(name.start) : null;
  const endDate = watch && name?.end ? watch(name.end) : null;

  // 폼 값이 변경되면 캘린더 상태 업데이트
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        setValueState([start, end]);
      }
    } else if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        setValueState(start);
      }
    }
  }, [startDate, endDate]);

  const handleChange = (val: Value) => {
    setValueState(val);

    if (Array.isArray(val) && val[0]) {
      const start = val[0];
      const end = val[1];

      if (name?.start && setValue) {
        if (end && name?.end) {
          const [sortedStart, sortedEnd] = start < end ? [start, end] : [end, start];
          setValue(name.start, formatDateForInput(sortedStart), { shouldValidate: true });
          setValue(name.end, formatDateForInput(sortedEnd), { shouldValidate: true });
        } else {
          setValue(name.start, formatDateForInput(start), { shouldValidate: true });
        }
      }
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수 (시간대 문제 해결)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatMonthYear = (locale: string | undefined, date: Date) => {
    console.log(locale);
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return `${monthNames[month]} ${year}년`;
  };

  return (
    <>
      <p className={errorMessage ? styles.calendar__errormessage : styles.calendar__message}>
        *{errorMessage || message}
      </p>
      <div className={styles.calendarWrapper}>
        <CalendarLib
          locale="en-US"
          selectRange
          value={value}
          onChange={handleChange}
          onClickDay={(date) => {
            if (name?.start && setValue) {
              setValue(name.start, formatDateForInput(date), { shouldValidate: true });
            }
          }}
          className={styles.calendar}
          formatDay={(_, date) => date.getDate().toString()}
          formatMonthYear={formatMonthYear}
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={true}
        />
      </div>
    </>
  );
};