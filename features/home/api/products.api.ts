import { endpoints, queryKeys } from "@/shared/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/shared/types";
import { api } from "@/shared/api/api";

// Products
export const useProductsQuery = () =>
  useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const { data } = await api.get<Product[]>(endpoints.products);
      return data;
    },
  });

export const useProductQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.product(id),
    queryFn: async () => {
      const { data } = await api.get<Product>(endpoints.product(id));
      return data;
    },
    enabled: !!id,
  });

export const useProductsByShopQuery = (shopId: string) =>
  useQuery({
    queryKey: queryKeys.productsByShop(shopId),
    queryFn: async () => {
      const { data } = await api.get<Product[]>(
        endpoints.productsByShop(shopId),
      );
      return data;
    },
    enabled: !!shopId,
  });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Product>) => {
      const { data } = await api.post<Product>(endpoints.products, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      const response = await api.put<Product>(endpoints.product(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(endpoints.product(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};

