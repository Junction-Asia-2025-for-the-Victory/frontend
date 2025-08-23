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
    return privateApi.post("/api/v1/episode", { episodeId });
  },
  answer: (audioFile: Blob) => {
    const formData = new FormData();
    formData.append("audioFile", audioFile, "recording.webm");
    return privateApi.post("/api/v1/episode/chat", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
