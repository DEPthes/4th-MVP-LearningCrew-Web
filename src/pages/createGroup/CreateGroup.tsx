import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema } from "../../hooks/createGroupSchema";
import { z } from "zod";
import { Input } from "../../components/common/Input";
import { Category } from "../../components/createGroup/Category";
import { CategoryData } from "../../assets/CategoryData";
import { UploadImg } from "../../components/createGroup/UploadImg";
import { SelectRange } from "../../components/createGroup/SelectRange";
import { Calendar } from "../../components/common/Calendar";
import { Container } from "../../components/createGroup/Container";
import { Button } from "../../components/createGroup/Button";
import styles from "../../styles/createGroup/CreateGroupPageStyle.module.css";
import { useEffect } from "react";
import Header from "../../components/header/Header";

type CreateGroup = z.infer<typeof createGroupSchema>;

export const CreateGroup = () => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      maxMembers: 3,
      step: 3,
      steps: [],
    },
  });

  const stepCount = Number(watch("step") ?? 3);
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    trigger("steps");
  }, [startDate, endDate]);

  useEffect(() => {
    const currentSteps = getValues("steps");

    // 이미 같은 개수면 다시 초기화하지 않음 (무한 루프 방지)
    if (currentSteps.length === stepCount) return;

    const newSteps = Array.from({ length: stepCount }, (_, i) => {
      // 기존 데이터가 있으면 보존, 없으면 새로 생성
      const existingStep = currentSteps[i];
      return existingStep || {
        step: i + 1,
        startDate: "",
        endDate: "",
      };
    });

    setValue("steps", newSteps, { shouldValidate: false, shouldDirty: false });
  }, [stepCount, getValues, setValue]);

  return (
    <>
      <Header />
      <div className={styles.creategroup__container}>
        <p className={styles.container__title}>그룹 개설</p>

        <Container title="그룹명">
          <Input
            holder="스터디 이름을 작성해 주세요."
            message="스터디 이름을 입력하세요."
            maxLength={10}
            errorMessage={errors.name?.message}
            register={register("name")}
          />
        </Container>

        <Container title="카테고리">
          <Category
            name="categories"
            data={CategoryData}
            message="카테고리를 선택해 주세요. (최대 3개)"
            errorMessage={errors.categories?.message}
            setValue={setValue}
          />
        </Container>

        <Container title="소개글">
          <Input
            holder="소개글을 작성해 주세요."
            message="소개글을 입력하세요."
            errorMessage={errors.summary?.message}
            additional="15글자 내"
            maxLength={15}
            register={register("summary")}
          />
        </Container>

        <Container title="그룹 대표 이미지 설정">
          <UploadImg
            name="groupImage"
            message="그룹 대표 이미지는 최대 50mb까지 업로드 가능합니다."
            message2="그룹 대표 이미지를 설정해 주세요."
            errorMessage={errors.groupImage?.message === "그룹 대표 이미지가 50mb를 초과하였습니다." ? errors.groupImage.message : undefined}
            errorMessage2={errors.groupImage?.message === "그룹 대표 이미지가 설정되지 않았습니다." ? errors.groupImage.message : undefined}
            setValue={setValue}
          />
        </Container>

        <Container title="모집인원">
          <SelectRange
            name="maxMembers"
            messgae="모집 인원을 작성해 주세요."
            max={20}
            unit="명"
            setValue={setValue}
          />
        </Container>

        <Container title="그룹 일정">
          <Calendar
            message="스터디 시작일과 종료일을 선택해 주세요."
            errorMessage={errors.startDate?.message || errors.endDate?.message}
            name={{ start: "startDate", end: "endDate" }}
            setValue={setValue}
            watch={watch}
          />
        </Container>

        <Container title="STEP 개수">
          <SelectRange
            name="step"
            messgae="STEP 개수를 입력해 주세요."
            max={10}
            unit="STEP"
            setValue={setValue}
          />
        </Container>

        {stepCount && Array.from({ length: stepCount }).map((_, idx) => {
          const stepErrors = errors.steps as any;
          const stepError = stepErrors?.[idx];

          return (
            <Container key={idx} title={`STEP ${idx + 1} 일정`}>
              <Calendar
                message={`STEP ${idx + 1} 시작일과 종료일을 선택해 주세요.`}
                errorMessage={
                  stepError?.startDate?.message ||
                  stepError?.endDate?.message
                }
                name={{ start: `steps.${idx}.startDate`, end: `steps.${idx}.endDate` }}
                setValue={setValue}
                watch={watch}
              />
            </Container>
          );
        })}


        <Button handleSubmit={handleSubmit} />
      </div>
    </>
  );
};