import { useMutation, useQuery } from "@tanstack/react-query";
import { userAuthApi } from "../api/userAuth";
import type { AxiosError } from "axios";

export const useAuthCheck = () => {
  return useQuery({
    queryKey: ["userAuthCheck"],
    queryFn: async () => {
      const response = await userAuthApi.check();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSetProfile = () => {
  return useMutation({
    mutationKey: ["setProfile"],
    mutationFn: async ({
      nickname,
      gender,
    }: {
      nickname: string;
      gender: "male" | "female";
    }) => {
      const response = await userAuthApi.setProfile(nickname, gender);
      return response.data;
    },
  });
};
