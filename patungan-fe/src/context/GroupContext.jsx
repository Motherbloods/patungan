import { createContext, useCallback, useContext, useState } from "react";
import groupService from "../services/groupService";

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroups must be used within GroupsProvider");
  }

  return context;
};

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);

      const groups = await groupService.getAll();
      setGroups(groups);
    } catch (e) {
      setError(e.message || "Error Fetching Groups");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = { groups, error, isLoading, fetchGroups };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};
