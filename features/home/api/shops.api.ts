import { endpoints, queryKeys } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import type { Shop } from "@/shared/types";
import { api } from "@/shared/api/api";

// Shops
export const useShopsQuery = () =>
  useQuery({
    queryKey: queryKeys.shops,
    queryFn: async () => {
      const { data } = await api.get<Shop[]>(endpoints.shops);
      return data;
    },
  });

export const useShopQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.shop(id),
    queryFn: async () => {
      const { data } = await api.get<Shop>(endpoints.shop(id));
      return data;
    },
    enabled: !!id,
  });

