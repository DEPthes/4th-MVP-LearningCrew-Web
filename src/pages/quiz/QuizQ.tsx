import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/quiz/QuizQPageStyle.module.css";
import ProgressQuizBackground from "../../assets/ProgressQuizBackground.svg";
import Click from "../../assets/QuizCheck.svg";
import UnClick from "../../assets/QuizNonCheck.svg";
import { QuizDummy } from "../../assets/quizDummy";

export const QuizQ = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const currentQuestion = QuizDummy.find(q => q.id === currentQuestionId);
  const totalQuestions = QuizDummy.length;
  const isFirstQuestion = currentQuestionId === 1;
  const isLastQuestion = currentQuestionId === totalQuestions;

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionId]: answerId
    }));
    setShowError(false);
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate(`/group/${groupId}/quiz`);
      return;
    }

    if (!isFirstQuestion) {
      setCurrentQuestionId(prev => prev - 1);
      setShowError(false);
    }
  };

  const handleNext = () => {
    const hasSelectedAnswer = selectedAnswers[currentQuestionId] !== undefined;

    if (!hasSelectedAnswer) {
      setShowError(true);
      return;
    }

    if (isLastQuestion) {
      // 마지막 문제이고 모든 답을 선택했으면 결과 페이지로 이동
      const allQuestionsAnswered = QuizDummy.every(q => selectedAnswers[q.id] !== undefined);
      if (allQuestionsAnswered) {
        navigate("/quiz");
      } else {
        setShowError(true);
      }
    } else {
      setCurrentQuestionId(prev => prev + 1);
      setShowError(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className={styles.quizq__container}>
      <img src={ProgressQuizBackground} className={styles.quizq__background} />
      <div className={styles.quizq__content}>
        <div className={styles.quizq__content__container}>
          <div className={styles.quizq__progress}>
            <div className={styles.quizq__progress__number}>{currentQuestionId}/{totalQuestions}</div>
          </div>

          <div className={styles.quizq__question}>
            <p>{currentQuestion.problem}</p>
          </div>

          <div className={styles.quizq__answers}>
            {currentQuestion.answers.map((answer) => (
              <div
                key={answer.id}
                className={styles.quizq__answer}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <img
                  src={selectedAnswers[currentQuestionId] === answer.id ? Click : UnClick}
                  alt="radio button"
                  className={styles.quizq__radio}
                />
                <p>{answer.content}</p>
              </div>
            ))}
          </div>
          <p className={styles.quizq__error}>{showError ? "*정답이 선택되지 않았습니다" : " "}</p>
          <div className={styles.quizq__navigation}>
            <button onClick={handlePrevious} className={styles.quizq__prev}>
              <p>이전</p>
            </button>
            <button onClick={handleNext} className={styles.quizq__next}>
              <p>{isLastQuestion ? "제출" : "다음"}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};