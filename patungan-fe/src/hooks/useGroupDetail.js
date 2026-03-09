import { useState, useEffect } from "react";
import groupList from "../config/group_list";
function useGroupDetail(groupId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      await new Promise((res) => setTimeout(res, 300));

      if (!isMounted) return;
      const found = groupList.find((g) => g.id === Number(groupId));

      if (!found) {
        setError("Group not found");
        setLoading(false);
        return;
      }
      setData(found);
      setLoading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [groupId]);
  return {
    loading,
    error,
    group: data ?? null,
  };
}

export default useGroupDetail;
