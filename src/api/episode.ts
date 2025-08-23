import { privateApi } from "./apiClient";

interface episodeDetail {
  episodeId: number;
  episodeTitle: string;
}

interface episodeListResponse {
  likeability: number;
  progress: number;
  episodeDetail: episodeDetail[];
}

export const episodeApi = {
  getList: () => {
    return privateApi.get<episodeListResponse>("/api/v1/episode");
  },
  start: (episodeId: number) => {
    return privateApi.post("/api/v1/episode", episodeId);
  },
};
