import styles from "../../styles/quiz/QuizPageStyle.module.css";
import StartQuizBackground from "../../assets/StartQuizBackground.svg";
import EndQuizBackground from "../../assets/EndQuizBackground.svg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuiz, getQuizResult } from "../../apis/studygroup/Quiz";
import { Lock } from "../../components/common/Lock";
import { useQuiz } from "../../hooks/QuizContext";
import { getStudyGroup } from "../../apis/studygroup/StudyGroup";


export const Quiz = () => {
  const [isQuiz, setIsQuiz] = useState<boolean>(false); //퀴즈 생성 여부
  const [canAccessGroup, setCanAccessGroup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [canAccessStep, setCanAccessStep] = useState<boolean>(true);
  const { groupId } = useParams<{ groupId: string }>();
  const { stepId } = useParams<{ stepId: string }>();
  const navigator = useNavigate();

  // Context에서 퀴즈 관련 상태와 함수들을 가져옴
  const {
    setQuizData,
    score,
    setScore,
    isQuizCompleted,
    setIsQuizCompleted,
    resetQuiz
  } = useQuiz();

  const handleIsQuiz = () => {
    //서버를 통해 퀴즈가 있는걸 받아오고 퀴즈가 있으면 퀴즈 페이지로 이동
    if (isQuiz && !isQuizCompleted) {
      navigator(`/group/${groupId}/step/${stepId}/quiz/questions`);
    }
  }

  //전역으로 바꾸기
  useEffect(() => {
    const fetchStudyGroup = async () => {
      try {
        const response = await getStudyGroup(groupId ?? "1");
        const groupCurrentStep = response.currentStep;
        if (groupCurrentStep < parseInt(stepId ?? "0")) setCanAccessStep(false);
        setLoading(false);
      } catch (error) {
        console.error("스터디 그룹을 가져오는데 실패했습니다:", error);
        setLoading(false);
        setCanAccessStep(false);
      }
    };
    fetchStudyGroup();
  }, [groupId, stepId]);

  useEffect(() => {
    // 컴포넌트 마운트 시에만 퀴즈 상태 초기화
    resetQuiz();
  }, []) // 마운트 시에만 실행

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (groupId && stepId) {
          const response = await getQuiz({ groupId: groupId, stepId: stepId });
          setCanAccessGroup(true);
          setQuizData(response); // Context에 퀴즈 데이터 저장
          if (response.length > 0) setIsQuiz(true);
        }
      } catch (error: any) {
        //로그인이 풀렸을 때, 스터디 그룹 멤버가 아닐 때
        if (error?.response?.status == 401 || error?.response?.data?.codeName == "STUDY_GROUP_NOT_MEMBER") {
          setCanAccessGroup(false);
        } else setCanAccessGroup(true);
      }
    };
    fetchQuiz();
  }, [groupId, stepId, setQuizData]);

  // 퀴즈 결과를 별도로 가져오기
  useEffect(() => {
    const fetchQuizResult = async () => {
      if (groupId && stepId) {
        try {
          const response = await getQuizResult(groupId);
          response.content.forEach((item: any) => {
            if (item.step === parseInt(stepId ?? "0")) {
              setScore(item.correctCount);
              setIsQuizCompleted(true);
              setIsQuiz(true);
            }
          });
        } catch (error) {
          console.error("퀴즈 결과 조회 실패:", error);
        }
      }
    };
    fetchQuizResult();
  }, [groupId, stepId, setScore, setIsQuizCompleted]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.startquiz__container}>
      {
        !canAccessGroup ? (
          <Lock />
        ) : (
          !canAccessStep ? <Lock text="아직 확인할 수 없습니다" /> :
            !isQuizCompleted && isQuiz ?
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
              : isQuizCompleted && isQuiz ? <>
                <img className={styles.startquiz__background} src={EndQuizBackground} />
                <div className={styles.startquiz__content__done}>
                  <p className={styles.startquiz__content__step}>{stepId} STEP 시험 결과</p>
                  <div className={styles.startquiz__score__container}>
                    <p className={styles.startquiz__content__score}>{score}/20</p>
                    <p className={styles.startquiz__content__score__text}>문제</p>
                  </div>
                  <div>
                  </div><p className={styles.startquiz__content__score__alert}>20문제 중에 {score}문제를 맞추셨어요!</p>
                </div>
              </>
                : <Lock text="퀴즈 생성 전입니다" />
        )
      }
    </div>
  )
}