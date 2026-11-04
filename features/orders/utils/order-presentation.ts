import type { Order } from "@/shared/mocks/mock-data";

export type OrderFilter = "all" | "active" | "completed" | "cancelled";

export const orderFilters: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "completed", label: "Завершённые" },
  { value: "cancelled", label: "Отменённые" },
];

export const orderTypes = {
  delivery: { label: "Доставка", icon: "bag-handle-outline" },
  service: { label: "Услуга", icon: "construct-outline" },
  booking: { label: "Бронирование", icon: "calendar-outline" },
} as const;

/** Отбирает заказы по статусу, ставит активные первыми и сортирует по дате без изменения источника. */
export function filterOrders(orders: readonly Order[], filter: OrderFilter) {
  return orders
    .filter(
      (order) =>
        filter === "all" ||
        (filter === "active" ? isActiveOrder(order) : order.status === filter),
    )
    .sort(
      (a, b) =>
        Number(isActiveOrder(b)) - Number(isActiveOrder(a)) ||
        Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
}

/** Считает активными ожидающие и выполняемые заказы независимо от их типа. */
export function isActiveOrder(order: Order) {
  return order.status === "pending" || order.status === "in_progress";
}

/** Даёт статус с учётом типа: выполнение услуги не называется доставкой. */
export function getOrderStatus(order: Order) {
  if (order.status === "cancelled")
    return {
      label: "Отменён",
      tone: "error",
      icon: "close-circle-outline",
    } as const;
  if (order.status === "completed")
    return {
      label: order.type === "delivery" ? "Доставлен" : "Завершён",
      tone: "success",
      icon: "checkmark-circle-outline",
    } as const;
  if (order.status === "pending")
    return {
      label: "Ждёт подтверждения",
      tone: "warning",
      icon: "time-outline",
    } as const;
  return {
    label:
      order.type === "delivery"
        ? "В пути"
        : order.type === "booking"
          ? "Бронь подтверждена"
          : "В работе",
    tone: "info",
    icon: "ellipse-outline",
  } as const;
}

/** Форматирует дату из заказа с годом; некорректную дату заменяет понятной подписью. */
export function formatOrderDate(value: string, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Дата не указана";
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? ({ hour: "2-digit", minute: "2-digit" } as const) : {}),
  });
}

/** Отображает сумму в рублях, сохраняя копейки, если они есть. */
export function formatOrderAmount(value: number) {
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₽`;
}
