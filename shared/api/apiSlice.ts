import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Product, Review, ServiceCategory, Shop } from "../types";
import { api } from "./api";

export const endpoints = {
  // Service Categories
  serviceCategories: "/serviceCategories",
  serviceCategory: (id: string) => `/serviceCategories/${id}`,

  // Products
  products: "/products",
  product: (id: string) => `/products/${id}`,
  productsByShop: (shopId: string) => `/products?shopId=${shopId}`,

  // Orders
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,

  // Shops
  shops: "/shops",
  shop: (id: string) => `/shops/${id}`,

  // Reviews
  reviews: "/reviews",
  review: (id: string) => `/reviews/${id}`,
} as const;

// Query Keys
const queryKeys = {
  serviceCategories: ["serviceCategories"] as const,
  serviceCategory: (id: string) => ["serviceCategory", id] as const,
  products: ["products"] as const,
  product: (id: string) => ["product", id] as const,
  productsByShop: (shopId: string) => ["products", shopId] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  shops: ["shops"] as const,
  shop: (id: string) => ["shop", id] as const,
  reviews: ["reviews"] as const,
};

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
