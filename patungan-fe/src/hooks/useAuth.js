import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

export const useVerifyAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: authService.verifyAuth,
    refetchOnWindowFocus: false,
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

export const useLoginGoogle = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (idToken) => authService.loginGoogle(idToken),
    onSuccess: () => {
      client.invalidateQueries(["auth"]);
    },
  });
};
export const useVerifyLoginToken = (idToken, isAuthenticated) => {
  return useQuery({
    queryKey: ["verifyLoginToken", idToken],
    queryFn: () => authService.verifyLoginToken(idToken),
    enabled: !!idToken && !isAuthenticated,
    retry: false, // ← stop retry saat error
    refetchInterval: (query) => {
      if (query.state.data?.isAuthenticated) return false;
      if (query.state.error) return false; // ← stop saat error
      return 2000;
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

export const useLinkGoogle = () => {
  return useMutation({
    mutationFn: (idToken) => authService.linkGoogle(idToken),
  });
};

export const useLinkTelegram = () => {
  return useMutation({
    mutationFn: authService.requestLinkTelegram,
    onError: (error) => {
      console.error("Link telegram failed:", error);
    },
  });
};

export const useVerifyLinkToken = (linkToken) => {
  return useQuery({
    queryKey: ["verifyLinkToken", linkToken],
    queryFn: () => authService.verifyLinkToken(linkToken),
    enabled: !!linkToken,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, // tambah ini juga
    refetchInterval: (query) => {
      if (query.state.data?.linked === true) return false; // stop kalau linked
      if (query.state.error) return false;
      return 2000;
    },
  });
};
