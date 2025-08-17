import { useEffect, useState, useCallback } from "react";
import { getStudyByStep, type StepStudy } from "../apis/Group/StudyGroupStep";

export function useStepStudy(groupId: number, step: number) {
  const [data, setData] = useState<StepStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getStudyByStep(groupId, step);
      setData(res);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "스터디 정보를 불러오는 중 오류가 발생했어요.";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [groupId, step]);

  useEffect(() => {
    if (!groupId || !step) return;
    fetchData();
  }, [groupId, step, fetchData]);

  return { data, loading, error, refetch: fetchData };
}