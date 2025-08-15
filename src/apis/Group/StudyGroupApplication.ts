// src/apis/Group/StudyGroupApplication.ts
import { api } from "../common/client"

export type ApplicationState = "PENDING" | "APPROVED" | "REJECTED"

export interface AppUser {
  id: number
  email: string
  nickname: string
  gender?: string
}

export interface AppStudyGroup {
  id: number
  name: string
  maxMembers?: number
  memberCount?: number
}

export interface Application {
  user: AppUser
  studyGroup: AppStudyGroup
  createdAt: string
  lastModifiedAt: string
  approvedAt?: string
  state: ApplicationState
}

export interface PageMeta {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface PagedResponse<T> {
  content: T[]
  page: PageMeta
}

// 신청 목록(주최자)
export const getGroupApplications = async (
  groupId: number,
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {}
  const { data } = await api.get<PagedResponse<Application>>(
    `/api/study-groups/${groupId}/applications`,
    { params: { page, size, sort } }
  )
  return data
}

// 신청 승인/거절(주최자)
export const approveApplication = async (groupId: number, userId: number) => {
  const { data } = await api.post<Application>(
    `/api/study-groups/${groupId}/applications/${userId}/approve`
  )
  return data
}

export const rejectApplication = async (groupId: number, userId: number) => {
  const { data } = await api.post<Application>(
    `/api/study-groups/${groupId}/applications/${userId}/reject`
  )
  return data
}

// ✅ 가입 신청(본인)
export const applyToStudyGroup = async (groupId: number) => {
  // 백엔드 스펙: POST /api/study-groups/{id}/join  (본문 없음)
  const { data } = await api.post<Application>(`/api/study-groups/${groupId}/join`)
  return data
}

// ✅ 가입 취소(본인) — DELETE 미지원이면 POST /join/cancel 로 폴백
export const cancelMyApplication = async (groupId: number) => {
  try {
    const { data } = await api.delete<Application>(`/api/study-groups/${groupId}/join`)
    // 폴백이 필요 없으면 여기서 그대로 반환
    return data
  } catch (e: any) {
    const status = e?.response?.status
    // 폴백 트리거 로그 — 네트워크 탭에서 /join/cancel 보이는지 확인
    console.warn("[cancelMyApplication] DELETE /join failed, status:", status)
    if (status === 405 || status === 404) {
      // 백엔드에서 제공하는 취소용 대체 엔드포인트
      const { data } = await api.post<Application>(
        `/api/study-groups/${groupId}/join/cancel`
      )
      return data
    }
    throw e
  }
}

// ✅ 탈퇴(승인된 후 본인)
export const leaveStudyGroup = async (groupId: number) => {
  const res = await api.delete(`/api/study-groups/${groupId}/leave`)
  return res.status
}

// 내 신청 목록(본인)
export const getMyApplications = async (
  opts?: { page?: number; size?: number; sort?: string }
) => {
  const { page = 0, size = 10, sort = "createdAt,desc" } = opts ?? {}
  const { data } = await api.get<PagedResponse<Application>>(
    `/api/study-groups/my/applications`,
    { params: { page, size, sort } }
  )
  return data
}

// 특정 그룹에 대한 내 신청 1건(본인)
export const getMyApplicationForGroup = async (groupId: number) => {
  const paged = await getMyApplications({ size: 100 })
  return paged.content.find((a) => a.studyGroup.id === groupId) ?? null
}