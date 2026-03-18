import { createContext, useContext, useState } from "react";
import { useLogout } from "../hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const logoutApi = useLogout();

  const isAuthenticated = !!user;

  const logout = () => {
    logoutApi.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
      },
      onError: (err) => {
        console.error("Logout gagal:", err);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
