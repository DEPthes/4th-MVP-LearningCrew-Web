import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/quiz/QuizQPageStyle.module.css";
import ProgressQuizBackground from "../../assets/ProgressQuizBackground.svg";
import Click from "../../assets/QuizCheck.svg";
import UnClick from "../../assets/QuizNonCheck.svg";
import { useQuiz } from "../../hooks/QuizContext";
import { postQuiz } from "../../apis/studygroup/Quiz";

export const QuizQ = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();

  // Context에서 퀴즈 관련 상태와 함수들을 가져옴
  const {
    quizData,
    currentQuizIndex,
    setCurrentQuizIndex,
    setScore,
    setIsQuizCompleted
  } = useQuiz();

  const currentQuestion = quizData[currentQuizIndex];
  const totalQuestions = quizData.length;
  const isFirstQuestion = currentQuizIndex === 0;
  const isLastQuestion = currentQuizIndex === totalQuestions - 1;

  const handleAnswerSelect = (optionNum: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuizIndex]: optionNum
    }));
    setShowError(false);
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate(`/group/${groupId}/step/${stepId}/quiz`);
      return;
    }

    if (!isFirstQuestion) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowError(false);
    }
  };

  const handleNext = async () => {
    const hasSelectedAnswer = selectedAnswers[currentQuizIndex] !== undefined;

    if (!hasSelectedAnswer) {
      setShowError(true);
      return;
    }

    if (isLastQuestion) {
      // 마지막 문제이고 모든 답을 선택했으면 결과 계산 후 결과 페이지로 이동
      const allQuestionsAnswered = quizData.every((_, index) => selectedAnswers[index] !== undefined);
      if (allQuestionsAnswered) {
        if (groupId && stepId) {
          try {
            const response = await postQuiz({
              groupId: groupId,
              stepId: stepId,
              answers: quizData.map((question, index) => ({
                quizId: question.id,
                selectedOptions: [selectedAnswers[index]]
              }))
            })
            setScore(response.correctCount);
            setIsQuizCompleted(true);
            navigate(`/group/${groupId}/step/${stepId}/quiz`);
          } catch (error) {
            console.error("퀴즈 제출 실패:", error);
          }
        }
      } else {
        setShowError(true);
      }
    } else {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowError(false);
    }
  };

  if (!currentQuestion || quizData.length === 0) {
    return <div>퀴즈를 불러오는 중...</div>;
  }

  return (
    <div className={styles.quizq__container}>
      <img loading="lazy" src={ProgressQuizBackground} className={styles.quizq__background} />
      <div className={styles.quizq__content}>
        <div className={styles.quizq__content__container}>
          <div className={styles.quizq__progress}>
            <div className={styles.quizq__progress__number}>{currentQuizIndex + 1}/{totalQuestions}</div>
          </div>

          <div className={styles.quizq__question}>
            <p>{currentQuestion.quiz}</p>
          </div>

          <div className={styles.quizq__answers}>
            {currentQuestion.options.map((option) => (
              <div
                key={option.optionNum}
                className={styles.quizq__answer}
                onClick={() => handleAnswerSelect(option.optionNum)}
              >
                <img
                  src={selectedAnswers[currentQuizIndex] === option.optionNum ? Click : UnClick}
                  alt="radio button"
                  className={styles.quizq__radio}
                />
                <p>{option.content}</p>
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