import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

export const useVerifyAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: authService.verifyAuth,
  });
};

export const useRequestLogin = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: authService.requestLogin,
    onSuccess: () => {
      client.invalidateQueries(["auth"]);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
};

export const useLoginGoogle = (idToken) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => authService.loginGoogle(idToken),
    onSuccess: () => {
      client.invalidateQueries(["auth"]);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
};
export const useVerifyLoginToken = (idToken, isAuthenticated) => {
  const client = useQueryClient();

  return useQuery({
    queryKey: ["verifyLoginToken", idToken],
    queryFn: () => authService.verifyLoginToken(idToken),
    enabled: !!idToken && !isAuthenticated,
    refetchInterval: (data) => {
      if (data?.isAuthenticated) return false;
      return 2000;
    },
    onSuccess: () => {
      client.invalidateQueries(["auth"]);
    },
    onError: (error) => {
      console.error("Query failed:", error);
    },
  });
};
export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      client.invalidateQueries(["auth"]);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
};
