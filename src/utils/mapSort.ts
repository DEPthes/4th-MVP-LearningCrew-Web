import type { SortOrder as Order } from "../apis/common/studyGroups";

export type SortLabel = "최신순" | "오래된순" | "관련도순" | "가나다순";

type SortKey = "created_at" | "alphabet" | "relative";

export function mapSort(label: SortLabel, hasQuery: boolean): { sort: SortKey; order?: Order } {
  switch (label) {
    case "최신순":
      return { sort: "created_at", order: "desc" };
    case "오래된순":
      return { sort: "created_at", order: "asc" };
    case "가나다순":
      return { sort: "alphabet" };                
    case "관련도순":
      return hasQuery
        ? { sort: "relative" }                    
        : { sort: "created_at", order: "desc" };  
    default:
      return { sort: "created_at", order: "desc" };
  }
}