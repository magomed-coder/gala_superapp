import { endpoints, queryKeys } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import type { ServiceCategory } from "@/shared/types";
import { api } from "@/shared/api/api";

// Service Categories
export const useServiceCategoriesQuery = () =>
  useQuery({
    queryKey: queryKeys.serviceCategories,
    queryFn: async () => {
      const { data } = await api.get<ServiceCategory[]>(
        endpoints.serviceCategories,
      );

      console.log("Fetched service categories:", data);

      return data;
    },
  });

export const useServiceCategoryQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.serviceCategory(id),
    queryFn: async () => {
      const { data } = await api.get<ServiceCategory>(
        endpoints.serviceCategory(id),
      );
      return data;
    },
    enabled: !!id,
  });

