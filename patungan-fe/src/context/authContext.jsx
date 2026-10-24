import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../hooks/useAuth";
import authService from "../services/authService";
import LayoutSkeleton from "../components/LayoutSkeleton";
import {
  clearGuestSession,
  ensureGuestSession,
  hasGuestSession,
} from "../utils/guestSession";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const logoutApi = useLogout();
  const logoutApiRef = useRef(logoutApi);

  const isAuthenticated = !!user;
  const isActorReady = isAuthenticated || hasGuestSession();

  useEffect(() => {
    authService
      .verifyAuth()
      .then((data) => setUser(data?.user))
      .catch(() => {
        setUser(null);
        ensureGuestSession();
      })
      .finally(() => setLoading(false));
  }, []);

  const completeLogin = useCallback(async (nextUser) => {
    setUser(nextUser);

    let claimResult = null;

    if (hasGuestSession()) {
      try {
        claimResult = await authService.claimGuestData();
        clearGuestSession();
      } catch (error) {
        console.error("Claim guest data gagal:", error);
      }
    }

    await queryClient.invalidateQueries();
    return claimResult;
  }, [queryClient]);

  const clearActorQueries = useCallback(async () => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: ["auth"] }),
      queryClient.cancelQueries({ queryKey: ["groups"] }),
      queryClient.cancelQueries({ queryKey: ["expenses"] }),
      queryClient.cancelQueries({ queryKey: ["dashboard"] }),
    ]);

    queryClient.removeQueries({ queryKey: ["auth"] });
    queryClient.removeQueries({ queryKey: ["groups"] });
    queryClient.removeQueries({ queryKey: ["expenses"] });
    queryClient.removeQueries({ queryKey: ["dashboard"] });
  }, [queryClient]);

  const logout = (options = {}) => {
    logoutApiRef.current.mutate(undefined, {
      ...options,

      onSuccess: async (data, variables, context) => {
        setUser(null);
        ensureGuestSession();
        await clearActorQueries();
        await options.onSuccess?.(data, variables, context);
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
      completeLogin,
      isActorReady,
      loading,
      setLoading,
      logout,
      isAuthenticated,
      isLoggingOut: logoutApi.isPending,
    }),
    [
      user,
      completeLogin,
      isActorReady,
      loading,
      isAuthenticated,
      logoutApi.isPending,
    ],
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
