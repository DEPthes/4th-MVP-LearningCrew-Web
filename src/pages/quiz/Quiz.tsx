import styles from "../../styles/quiz/QuizPageStyle.module.css";
import StartQuizBackground from "../../assets/StartQuizBackground.svg";
import EndQuizBackground from "../../assets/EndQuizBackground.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Quiz = () => {
  const [isQuiz, setIsQuiz] = useState<boolean>(true); //퀴즈 생성 여부
  const [isDone, setIsDone] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [step, setStep] = useState<number>(1);

  const navigator = useNavigate();

  const handleIsQuiz = () => {
    //서버를 통해 퀴즈가 있는걸 받아오고 퀴즈가 있으면 퀴즈 페이지로 이동
    setIsQuiz(false);
    //퀴즈가 있으면 이동 없으면 setIsQuiz false로세팅
    //isQuiz 그대로 쓰면 안되고 변수 생성 해서 바로 받아와서 해야됨***바꿔***
    if (isQuiz && !isDone) navigator("/quiz/questions");
  }

  useEffect(() => {
    //서버에서 퀴즈를 풀었는지 여부를 받아옴, 동시에 본인 점수 세팅
    setIsDone(false);
    setScore(0);
    setStep(1);
  }, [])

  return (
    <div className={styles.startquiz__container}>
      {!isDone ?
        <>
          <img className={styles.startquiz__background} src={StartQuizBackground} />
          <div className={styles.startquiz__content}>
            <p className={styles.startquiz__content__title}>지금까지 공부한 내용을 테스트해 보세요</p>
            <p
              className={styles.startquiz__content__alert}
              style={{ color: isQuiz ? "var(--Gray2)" : "var(--MainColor2)" }}
            >
              {isQuiz ? "현재 STEP의 퀴즈는 다음 STEP 진행 시 생성됩니다" : "퀴즈 생성 전입니다"}
            </p>
            <button onClick={handleIsQuiz} className={styles.startquiz__button}>Start</button>
          </div>
        </>
        : <>
          <img className={styles.startquiz__background} src={EndQuizBackground} />
          <div className={styles.startquiz__content__done}>
            <p className={styles.startquiz__content__step}>{step} STEP 시험 결과</p>
            <div className={styles.startquiz__score__container}>
              <p className={styles.startquiz__content__score}>{score}/20</p>
              <p className={styles.startquiz__content__score__text}>문제</p>
            </div>
            <div>
            </div><p className={styles.startquiz__content__score__alert}>20문제 중에 {score}문제를 맞추셨어요!</p>
          </div>
        </>}
    </div>
  )
}