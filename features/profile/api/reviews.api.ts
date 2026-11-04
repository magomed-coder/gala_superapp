import { endpoints, queryKeys } from "@/shared/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Review } from "@/shared/types";
import { api } from "@/shared/api/api";

// Reviews
export const useReviewsQuery = () =>
  useQuery({
    queryKey: queryKeys.reviews,
    queryFn: async () => {
      const { data } = await api.get<Review[]>(endpoints.reviews);
      return data;
    },
  });

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Review>) => {
      const { data } = await api.post<Review>(endpoints.reviews, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
    },
  });
};
