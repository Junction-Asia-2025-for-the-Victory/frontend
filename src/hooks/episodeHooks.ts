import { episodeApi } from "@/api/episode";
import { useQuery } from "@tanstack/react-query";

export const useGetEpisodeList = () => {
  return useQuery({
    queryKey: ["episode-list"],
    queryFn: async () => {
      const response = await episodeApi.getList();
      return response.data;
    },
  });
};
