export interface GroupCategory {
 id: number;
 name: string;
}

export interface GroupOwner {
 id: number;
 email: string;
 nickname: string;
 role: string;
 gender: string;
 profileImage: {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
 } | null;
 createdAt: string;
 lastModifiedAt: string;
}

export interface GroupData {
 id: number;
 name: string;
 summary: string;
 maxMembers: number;
 groupImage: {
  uuid: string;
  fileName: string;
  size: number;
  handlingType: string;
 } | null;
 categories: GroupCategory[];
 memberCount: number;
 dibs: boolean;
 startDate: string;
 endDate: string;
 owner: GroupOwner;
 createdAt: string;
 lastModifiedAt: string;
}

// getAppliedGroup용 타입
export interface AppliedGroupData {
 user: {
  id: number;
  email: string;
  nickname: string;
  role: string;
  gender: string;
  profileImage: {
   uuid: string;
   fileName: string;
   size: number;
   handlingType: string;
  } | null;
  createdAt: string;
  lastModifiedAt: string;
 };
 studyGroup: GroupData;
 createdAt: string;
 lastModifiedAt: string;
 approvedAt: string;
 state: string;
}

export interface GroupPageInfo {
 size: number;
 number: number;
 totalElements: number;
 totalPages: number;
}

export interface GroupListResponse {
 content: GroupData[];
 page: GroupPageInfo;
}

// getAppliedGroup용 응답 타입
export interface AppliedGroupListResponse {
 content: AppliedGroupData[];
 page: GroupPageInfo;
}

// 기존 컴포넌트와의 호환성을 위한 변환된 타입
export interface TransformedGroupData {
 id: number;
 image: string | null;
 label: string;
 count: string;
 title: string;
 subtitle: string;
 person: string;
 categories: string[];
 isBookmarked: boolean;
 type: "joined" | "hosted" | "applied";
 state?: string;
}
