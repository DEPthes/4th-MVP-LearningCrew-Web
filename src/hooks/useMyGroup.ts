import axios from "axios";
import { getAuthHeader } from "../apis/auth/auth";
import { useQuery } from "@tanstack/react-query";

// API 호출 함수
const fetchStudyGroup = async (id: string) => {
  const { data } = await axios.get(`/api/study-groups/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};

const fetchUser = async () => {
  const { data } = await axios.get(`/api/users/me`, {
    // 오타 수정: suers -> users
    headers: getAuthHeader(),
  });
  return data;
};

// 스터디 그룹 정보 조회 훅
export const useMyGroup = (id: string) => {
  return useQuery({
    queryKey: ["studyGroup", id],
    queryFn: () => fetchStudyGroup(id),
    enabled: !!id,
  });
};

// 현재 사용자 정보 조회 훅
export const useMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchUser,
  });
};

// Owner 여부 확인 커스텀 훅
export const useIsGroupOwner = (groupId: string) => {
  const { data: studyGroup, isLoading: isGroupLoading } = useMyGroup(groupId);
  const { data: currentUser, isLoading: isUserLoading } = useMe();

  const isLoading = isGroupLoading || isUserLoading;

  // 데이터가 모두 로드되었을 때 owner 여부 확인
  const isOwner =
    !isLoading &&
    studyGroup?.owner?.id &&
    currentUser?.id &&
    studyGroup.owner.id === currentUser.id;

  return {
    isOwner,
    isLoading,
    studyGroup,
    currentUser,
    // 편의를 위한 추가 정보
    ownerId: studyGroup?.owner?.id,
    currentUserId: currentUser?.id,
  };
};

// 사용 예시:
/*
const StudyGroupComponent = ({ groupId }: { groupId: string }) => {
  const { 
    isOwner, 
    isLoading, 
    studyGroup, 
    currentUser 
  } = useIsGroupOwner(groupId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{studyGroup?.name}</h1>
      {isOwner ? (
        <button>Edit Group (Owner Only)</button>
      ) : (
        <p>You are a member of this group</p>
      )}
    </div>
  );
};
*/