import { endpoints, queryKeys } from "@/shared/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/shared/types";
import { api } from "@/shared/api/api";

// Orders
export const useOrdersQuery = () =>
  useQuery({
    queryKey: queryKeys.orders,
    queryFn: async () => {
      const { data } = await api.get<Order[]>(endpoints.orders);
      return data;
    },
  });

export const useOrderQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.order(id),
    queryFn: async () => {
      const { data } = await api.get<Order>(endpoints.order(id));
      return data;
    },
    enabled: !!id,
  });

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Order>) => {
      const { data } = await api.post<Order>(endpoints.orders, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      const response = await api.put<Order>(endpoints.order(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
};

