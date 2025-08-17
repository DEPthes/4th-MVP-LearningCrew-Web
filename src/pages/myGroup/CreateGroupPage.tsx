import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/myGroup/create.module.css";
import GroupCover from "../../assets/group-cover.svg";
import { Input } from "../../components/common/Input";
import { Calendar } from "../../components/common/Calendar";
import { Submit } from "../../components/common/Submit";
import Profile from "../../components/signUp/Profile";
import CapacitySelector from "../../components/myGroup/CapacitySelector";
import GroupTitle from "../../components/common/GroupTitle";

type FormValues = {
  title: string;
  intro: string;
  tags: string[];
  coverFile?: File | null;

  capacity: number;

  groupStart?: string;
  groupEnd?: string;

  stepCount: number;

  step1Start?: string;
  step1End?: string;

  step2Start?: string;
  step2End?: string;
};

const TAG_OPTIONS = [
  "언어",
  "디자인, 아트",
  "경영, 마케팅",
  "개발, 프로그래밍",
  "게임 개발",
  "보안, 네트워크",
  "커리어",
  "하드웨어",
  "대입 수능",
  "기타",
];

export default function CreateGroupPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      intro: "",
      tags: [],
      capacity: 8,
      stepCount: 2,
    },
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState(""); // 기타 입력값
  const [canSubmit, setCanSubmit] = useState(false);

  const handleCoverChange = (file: File | null) => {
    setValue("coverFile", file, { shouldValidate: true });
  };

  // 태그 (최대 3개)
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const has = prev.includes(tag);
      const next = has
        ? prev.filter((t) => t !== tag)
        : prev.length >= 3
          ? prev
          : [...prev, tag];

      if (tag === "기타" && has) setCustomTag("");

      const merged = customTag ? [...next, customTag] : next;
      setValue("tags", merged, { shouldValidate: true });
      return next;
    });
  };

  // 기타 입력 변경 시 tags 동기화
  const onChangeCustomTag = (v: string) => {
    setCustomTag(v);
    const merged = v ? [...selectedTags.filter((t) => t !== v), v] : selectedTags;
    setValue("tags", merged, { shouldValidate: true });
  };

  const titleVal = watch("title");
  const groupStart = watch("groupStart");
  const groupEnd = watch("groupEnd");

  const onSubmit = (data: FormValues) => {
    console.log("CREATE GROUP FORM DATA >>", data);
    alert("그룹이 개설되었습니다!");
  };


  const updateCanSubmit = () => {
    const ok = !!titleVal && !!groupStart && !!groupEnd;
    setCanSubmit(ok);
  };

  return (
    <div className={styles.page}>
      <form
        className={styles.container}
        onSubmit={handleSubmit(onSubmit)}
        onChange={updateCanSubmit}
      >

        <GroupTitle text="내 그룹 개설하기" color="var(--PointColor)" />

        {/* 스터디 이름 */}
        <section className={styles.block}>
          <label className={styles.label}>스터디 이름</label>
          <Input
            holder="스터디 이름을 입력하세요."
            message="스터디 이름을 입력하세요"
            register={register("title")}
            maxLength={50}
          />
        </section>

        {/* 카테고리 */}
        <section className={styles.block}>
          <label className={styles.label}>카테고리</label>
          <div className={styles.hint}>*카테고리를 선택해주세요.(최대 3개)</div>

          <div className={styles.tags}>
            {TAG_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tag} ${selectedTags.includes(t) ? styles.tagActive : ""
                  }`}
                onClick={() => toggleTag(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 기타 */}
          {selectedTags.includes("기타") && (
            <div className={styles.customTagBox}>
              <div className={styles.customTagLabel}>기타</div>
              <input
                type="text"
                className={styles.customTagInput}
                placeholder="스터디를 대표하는 키워드를 입력하세요."
                value={customTag}
                onChange={(e) => onChangeCustomTag(e.target.value)}
                maxLength={10}
              />
            </div>
          )}
        </section>

        {/* 소개글 */}
        <section className={styles.block}>
          <label className={styles.label}>소개글</label>
          <Input
            holder="소개글을 작성해 주세요."
            message="소개글을 작성해주세요."
            register={register("intro")} // (기존 title이던 부분 수정)
            maxLength={200}
          />
        </section>

        {/* 그룹 대표 이미지 업로드 */}
        <section className={styles.block}>
          <Profile
            onImageChange={handleCoverChange}
            placeholderSrc={GroupCover}
            labelText="그룹 대표 이미지 설정"
            infoText="*그룹 대표 이미지는 최대 50MB까지 업로드 가능합니다."
            helpText="*그룹 대표 이미지를 설정해 주세요."
            variant="rect"
            aspectRatio={16 / 9}
          />
        </section>

        {/* 모집인원 */}
        <section className={styles.block}>
          <CapacitySelector
            value={watch("capacity") ?? 8}
            onChange={(v) => setValue("capacity", v, { shouldValidate: true })}
            min={2}
            max={20}
          />
        </section>

        {/* 일정 */}
        <section className={styles.block}>
          <div className={styles.label}>그룹 일정</div>
          <Calendar
            message="스터디 시작일과 종료일을 선택해 주세요"
            name={{ start: "groupStart", end: "groupEnd" }}
            setValue={setValue}
            watch={watch}
          />
        </section>

        {/* STEP 개수 */}
        <section className={styles.block}>
          <CapacitySelector
            label="STEP 개수"
            value={watch("stepCount") ?? 2}
            onChange={(v) => setValue("stepCount", v, { shouldValidate: true })}
            min={1}
            max={10}
            pillFormatter={(v) => (
              <span className={styles.pillText}>
                최대 <b>{v}</b> STEP
              </span>
            )}
            help={["*STEP 개수를 입력하세요", "*최대 10개"]}
          />
        </section>

        {/* STEP 1 일정 */}
        <section className={styles.block}>
          <div className={styles.label}>STEP 1 일정</div>
          <Calendar
            message="STEP 1의 시작일과 종료일을 선택해 주세요"
            name={{ start: "step1Start", end: "step1End" }}
            setValue={setValue}
            watch={watch}
          />
        </section>

        {/* STEP 2 기간 (선택) */}
        {watch("stepCount") >= 2 && (
          <section className={styles.block}>
            <div className={styles.label}>STEP 2 일정</div>
            <Calendar
              message="STEP 2의 시작일과 종료일을 선택해 주세요"
              name={{ start: "step2Start", end: "step2End" }}
              setValue={setValue}
              watch={watch}
            />
          </section>
        )}

        {/* 개설 */}
        <div className={styles.submitWrapper}>
          <Submit
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onClick={handleSubmit(onSubmit)}
            text="개설"
          />
        </div>
      </form>
    </div>
  );
}
