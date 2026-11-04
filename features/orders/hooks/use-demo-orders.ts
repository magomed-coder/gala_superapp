import { fetchMockData, type Order } from "@/shared/mocks/mock-data";
import { useQuery } from "@tanstack/react-query";

/** Общий кеш демонстрационных заказов для списка и деталей; не использует серверный API. */
export function useDemoOrders() {
  return useQuery<Order[]>({
    queryKey: ["demo-orders"],
    queryFn: () => fetchMockData("orders"),
    // Локальные данные доступны и без интернета; ключ отделён от серверных заказов.
    networkMode: "always",
    staleTime: 60_000,
    retry: false,
  });
}
