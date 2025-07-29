import { z } from "zod";

export const createGroupSchema = z
 .object({
  name: z.string().min(1, "스터디 이름을 입력하지 않았습니다."),
  categories: z
   .array(z.string(), "카테고리를 선택해주세요.")
   .min(1, "카테고리를 1개 이상 선택해 주세요.")
   .max(3, "카테고리는 최대 3개까지 선택 가능합니다."),
  summary: z.string().min(1, "소개글을 작성하지 않았습니다.").max(15),
  image: z
   .custom<File>()
   .refine((file) => !!file, {
    message: "그룹 대표 이미지가 설정되지 않았습니다.",
   })
   .refine(
    (file) => file && file.size <= 50 * 1024 * 1024,
    "그룹 대표 이미지가 50mb를 초과하였습니다."
   ),

  personnel: z
   .number()
   .min(2, "모집 인원은 최소 2명입니다.")
   .max(20, "모집 인원은 최대 20명입니다."),
  startDate: z
   .string("스터디 시작일을 입력해 주세요.")
   .min(1, "스터디 시작일을 입력해 주세요."),
  endDate: z
   .string("스터디 종료일을 입력해 주세요.")
   .min(1, "스터디 종료일을 입력해 주세요."),
  step: z.number().min(2).max(10),
  steps: z.array(
   z.object({
    step: z.number(),
    startDate: z.string().min(1, "STEP의 시작일을 입력해 주세요."),
    endDate: z.string().min(1, "STEP의 종료일을 입력해 주세요."),
   })
  ),
 })
 .superRefine((data, ctx) => {
  const { startDate, endDate, steps } = data;

  if (steps.length === 0) return;

  // 각 step의 개별 필드 검증
  steps.forEach((step, index) => {
   if (!step.startDate) {
    ctx.addIssue({
     path: ["steps", index, "startDate"],
     code: z.ZodIssueCode.custom,
     message: `STEP ${index + 1}의 시작일을 입력해 주세요.`,
    });
   }

   if (!step.endDate) {
    ctx.addIssue({
     path: ["steps", index, "endDate"],
     code: z.ZodIssueCode.custom,
     message: `STEP ${index + 1}의 종료일을 입력해 주세요.`,
    });
   }
  });

  // 스터디 시작일과 종료일이 모두 입력되었을 때만 검증
  if (!startDate || !endDate) return;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // 유효한 날짜인지 확인
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

  // STEP 1의 시작일 < 스터디 시작일
  if (
   steps[0].startDate &&
   !isNaN(new Date(steps[0].startDate).getTime()) &&
   new Date(steps[0].startDate) < start
  ) {
   ctx.addIssue({
    path: ["steps", 0, "startDate"],
    code: z.ZodIssueCode.custom,
    message: "STEP 1의 시작일은 스터디 시작일 이후여야 합니다.",
   });
  }

  // 마지막 STEP의 종료일 > 스터디 종료일
  const lastIndex = steps.length - 1;
  if (
   steps[lastIndex].endDate &&
   !isNaN(new Date(steps[lastIndex].endDate).getTime()) &&
   new Date(steps[lastIndex].endDate) > end
  ) {
   ctx.addIssue({
    path: ["steps", lastIndex, "endDate"],
    code: z.ZodIssueCode.custom,
    message: `STEP ${
     lastIndex + 1
    }의 종료일은 스터디 종료일 이전이어야 합니다.`,
   });
  }

  // STEP[n] 시작일 <= STEP[n-1] 종료일 (n > 0)
  for (let i = 1; i < steps.length; i++) {
   const prevEnd = new Date(steps[i - 1].endDate);
   const currentStart = new Date(steps[i].startDate);

   if (
    steps[i - 1].endDate &&
    steps[i].startDate &&
    !isNaN(prevEnd.getTime()) &&
    !isNaN(currentStart.getTime()) &&
    currentStart <= prevEnd
   ) {
    ctx.addIssue({
     path: ["steps", i, "startDate"],
     code: z.ZodIssueCode.custom,
     message: `STEP ${i + 1}의 시작일은 STEP ${i}의 종료일 이후여야 합니다.`,
    });
   }
  }
 });
