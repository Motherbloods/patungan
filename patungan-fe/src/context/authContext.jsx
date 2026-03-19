import { createContext, useContext, useState, useEffect } from "react";
import { useLogout } from "../hooks/useAuth";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← HARUS true dari awal
  const logoutApi = useLogout();

  const isAuthenticated = !!user;

  useEffect(() => {
    authService
      .verifyAuth()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // ← baru boleh render setelah ini
      });
  }, []);

  const logout = () => {
    logoutApi.mutate(undefined, {
      onSuccess: () => setUser(null),
      onError: (err) => console.error("Logout gagal:", err),
      onSettled: () => setLoading(false),
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
