import type { UseAuthCheckResponse } from "../types/user";
import { privateApi, publicApi } from "./apiClient";

export const userAuthApi = {
  login: () => {
    return publicApi.get("");
  },
  check: () => {
    return privateApi.get<UseAuthCheckResponse>("/api/v1/auth/login");
  },
  logout: () => {
    return privateApi.get("/api/v1/auth/logout");
  },
  setProfile: (nickname: string, gender: "male" | "female") => {
    return privateApi.patch("/api/v1/user/profile", { nickname, gender });
  },
};
