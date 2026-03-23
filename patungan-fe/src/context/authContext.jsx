import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLogout } from "../hooks/useAuth";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutApi = useLogout();
  const logoutApiRef = useRef(logoutApi);

  const isAuthenticated = !!user;

  useEffect(() => {
    authService
      .verifyAuth()
      .then((data) => setUser(data?.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = (options = {}) => {
    logoutApiRef.current.mutate(undefined, {
      ...options,

      onSuccess: (data, variables, context) => {
        setUser(null);
        options.onSuccess?.(data, variables, context);
      },

      onError: (err, variables, context) => {
        console.error("Logout gagal:", err);
        options.onError?.(err, variables, context);
      },

      onSettled: (data, error, variables, context) => {
        setLoading(false);
        options.onSettled?.(data, error, variables, context);
      },
    });
  };
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        logout,
        isAuthenticated,
        isLoggingOut: logoutApi.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
