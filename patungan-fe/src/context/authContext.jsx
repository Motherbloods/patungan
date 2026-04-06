import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { useLogout } from "../hooks/useAuth";
import authService from "../services/authService";
import LayoutSkeleton from "../components/LayoutSkeleton";

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

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      logout,
      isAuthenticated,
      isLoggingOut: logoutApi.isPending,
    }),
    [user, loading, isAuthenticated, logoutApi.isPending],
  );

  if (loading) {
    return <LayoutSkeleton />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
