import type { SortKey, SortOrder as Order } from "../apis/common/studyGroups";

export type SortLabel = "최신순" | "오래된순" | "관련도순" | "가나다순";

export function mapSort(label: SortLabel): { sort: SortKey; order: Order } {
  switch (label) {
    case "최신순":
      return { sort: "createdAt", order: "desc" };
    case "오래된순":
      return { sort: "createdAt", order: "asc" };
    case "가나다순":
      return { sort: "createdAt", order: "asc" };
    case "관련도순":
      return { sort: "createdAt", order: "desc" };
    default:
      return { sort: "createdAt", order: "desc" };
  }
}
