import { useParams } from "react-router-dom";
import HostGroupStudy from "../hostGroupStudy/HostGroupStudy";
import MyGroupStudy from "../myGroupStudy/MyGroupStudy";
import { useIsGroupOwner } from "../../hooks/useMyGroup";

/** Study 탭에서 주최자/참여자 분기 */
export default function StudySwitch() {
  const { groupId: groupIdParam } = useParams<{ groupId: string }>();
  const { isOwner } = useIsGroupOwner(groupIdParam!);
  return isOwner ? <HostGroupStudy /> : <MyGroupStudy />;
}