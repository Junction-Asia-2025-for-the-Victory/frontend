import { episodeApi } from "@/api/episode";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetEpisodeList = () => {
  return useQuery({
    queryKey: ["episode-list"],
    queryFn: async () => {
      const response = await episodeApi.getList();
      return response.data;
    },
  });
};

export const useStartEpisode = () => {
  return useMutation({
    mutationKey: ["start-episode"],
    mutationFn: async (episodeId: number) => {
      const response = await episodeApi.start(episodeId);
      return response.data;
    },
  });
};
