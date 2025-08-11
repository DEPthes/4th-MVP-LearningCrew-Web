import { Submit } from "../../components/common/Submit";
import styles from "../../styles/myNote/MyNotePageStyle.module.css";
import { useNavigate, useParams } from "react-router-dom";

export const MyNote = () => {
  // const [canWrite, setCanWrite] = useState<boolean>(true);//그 주차에 작성했으면 작성 못하게
  const navigator = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  //content 받고 이미지 처리 해서 넘기기
  const title = "다3주차 스터디";
  const content = `
    <h2>TypeScript 기초</h2>
    
    <p>이번 주에는 TypeScript의 기본 문법을 학습했습니다.ddddddddddddddddddddddddddddddddddd</p>
    
    <h3>주요 개념</h3>
    <ul>
      <li>타입 정의</li>
      <li>인터페이스</li>
      <li>제네릭</li>
    </ul>
    
    <p>TypeScript는 JavaScript의 <em>상위 집합</em>입니다.</p>
    
    <h3>예시 코드</h3>
    <pre><code>interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}</code></pre>
  `;

  return (
    <div className={styles.mynote__container}>
      <div className={styles.mynote__content__container}>
        <div className={styles.mynote__title}>{title}</div>
        <div className={styles.mynote__content}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <div className={styles.mynote__submit__container}>
        <Submit text="작성" onClick={() => { navigator(`/group/${groupId}/myNote/write`) }} canSubmit={true} />
      </div>
    </div>
  )
}