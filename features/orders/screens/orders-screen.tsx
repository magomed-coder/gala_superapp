import { Card } from "@/shared/components/card";
import { IconCatalog } from "@/features/orders/components/icon-catalog";
import { useAppTheme } from "@/shared/theme";
import { Text } from "@/shared/components/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, type Order } from "@/shared/mocks/mock-data";
import { SafeAreaView } from "react-native-safe-area-context";

// Типы для статусов заказа и доставки
export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type DeliveryStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type StatusConfig = {
  label: string;
  color: string;
  icon: string;
  bgColor: string;
};

export type StatusConfigMap = Record<OrderStatus, StatusConfig>;
export type DeliveryStatusConfigMap = Record<DeliveryStatus, StatusConfig>;

const STATUS_CONFIG: StatusConfigMap = {
  completed: {
    label: "Завершён",
    color: "#10B981",
    icon: "checkmark-circle",
    bgColor: "#D1FAE5",
  },
  in_progress: {
    label: "В пути",
    color: "#F59E0B",
    icon: "time",
    bgColor: "#FEF3C7",
  },
  pending: {
    label: "Ожидание",
    color: "#3B82F6",
    icon: "hourglass",
    bgColor: "#DBEAFE",
  },
  cancelled: {
    label: "Отменён",
    color: "#EF4444",
    icon: "close-circle",
    bgColor: "#FEE2E2",
  },
};

const DELIVERY_STATUS_CONFIG: DeliveryStatusConfigMap = {
  pending: {
    label: "Ожидание доставки",
    color: "#3B82F6",
    icon: "hourglass",
    bgColor: "#DBEAFE",
  },
  in_progress: {
    label: "Доставка в пути",
    color: "#F59E0B",
    icon: "bicycle",
    bgColor: "#FEF3C7",
  },
  completed: {
    label: "Доставлено",
    color: "#10B981",
    icon: "checkmark-circle",
    bgColor: "#D1FAE5",
  },
  cancelled: {
    label: "Доставка отменена",
    color: "#EF4444",
    icon: "close-circle",
    bgColor: "#FEE2E2",
  },
};

const ORDER_TYPES = {
  delivery: {
    label: "Доставка",
    icon: "bicycle",
    color: "#3B82F6",
  },
  service: {
    label: "Услуга",
    icon: "construct",
    color: "#8B5CF6",
  },
  booking: {
    label: "Бронирование",
    icon: "calendar",
    color: "#10B981",
  },
};

export default function OrdersScreen() {
  const theme = useAppTheme();
  const [showIconCatalog, setShowIconCatalog] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState<string[]>(["all"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /** Обновляет список из того же источника, который использует экран деталей заказа. */
  const loadOrders = async () => {
    const data = await fetchMockData("orders");
    setOrders(data);
  };

  useEffect(() => {
    // Первая загрузка завершается только после получения демонстрационных заказов.
    let active = true;
    fetchMockData("orders").then((data: Order[]) => {
      if (!active) return;
      setOrders(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const toggleFilter = (filter: string) => {
    if (filter === "all") {
      setFilters(["all"]);
    } else {
      let newFilters = filters.filter((f) => f !== "all");
      if (newFilters.includes(filter)) {
        newFilters = newFilters.filter((f) => f !== filter);
        if (newFilters.length === 0) {
          newFilters = ["all"];
        }
      } else {
        newFilters = [...newFilters, filter];
      }
      setFilters(newFilters);
    }
  };

  const filteredOrders = filters.includes("all")
    ? orders
    : orders.filter((order) => filters.includes(order.status));

  type Step = { label: string; completed: boolean; time?: string };
  const statusSteps: Record<string, Step[]> = {
    pending: [
      { label: "Принят", completed: true, time: "10:30" },
      { label: "Подтверждён", completed: false },
      { label: "В пути", completed: false },
      { label: "Доставлен", completed: false },
    ],
    in_progress: [
      { label: "Принят", completed: true, time: "10:30" },
      { label: "Подтверждён", completed: true, time: "10:45" },
      { label: "В пути", completed: true, time: "11:15" },
      { label: "Доставлен", completed: false },
    ],
    completed: [
      { label: "Принят", completed: true, time: "10:30" },
      { label: "Подтверждён", completed: true, time: "10:45" },
      { label: "В пути", completed: true, time: "11:15" },
      { label: "Доставлен", completed: true, time: "12:00" },
    ],
  };

  const renderStatusTimeline = (status: Order["status"]) => {
    const steps: Step[] = statusSteps[status] || statusSteps["pending"];

    return (
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={index} style={styles.timelineStep}>
            <View style={styles.timelineLineContainer}>
              <View
                style={[
                  styles.timelineDot,
                  step.completed && {
                    backgroundColor: STATUS_CONFIG[status].color,
                  },
                ]}
              >
                {step.completed && (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                )}
              </View>
              {/* Линия теперь идёт от центра кружка до центра следующего кружка */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      left: "50%",
                      right: "-50%",
                      width: "100%",
                      position: "absolute",
                      top: 12, // половина высоты кружка
                    },
                    step.completed && {
                      backgroundColor: STATUS_CONFIG[status].color,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineText}>
              <Text
                variant="r400.12"
                color={step.completed ? "#111827" : "#9CA3AF"}
              >
                {step.label}
              </Text>
              {step.time && (
                <Text variant="r400.11" color="#6B7280">
                  {step.time}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderOrderTypeBadge = (type: string = "delivery") => {
    const config =
      ORDER_TYPES[type as keyof typeof ORDER_TYPES] || ORDER_TYPES.delivery;
    return (
      <View
        style={[styles.typeBadge, { backgroundColor: config.color + "15" }]}
      >
        <Ionicons name={config.icon as any} size={12} color={config.color} />
        <Text variant="r400.11" style={{ color: config.color, marginLeft: 4 }}>
          {config.label}
        </Text>
      </View>
    );
  };

  if (showIconCatalog) {
    return <IconCatalog onClose={() => setShowIconCatalog(false)} />;
  }

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="time-outline" size={48} color="#3B82F6" />
          <Text variant="r600.16" style={{ marginTop: 16 }}>
            Загружаем заказы...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Временный вход в подбор значка, пока пользователь выбирает оформление вкладки. */}
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setShowIconCatalog(true)}
        style={{
          minHeight: 44,
          justifyContent: "center",
          paddingHorizontal: theme.spacing.md,
        }}
      >
        <Text style={{ color: theme.colors.text.primary }}>
          Выбрать иконку вкладки
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Фильтры */}
        <View style={styles.filterSection}>
          {/* <Text variant="r600.16" style={styles.sectionTitle}>
            Фильтровать
          </Text> */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {[
              { key: "all", label: "Все", icon: "grid" },
              { key: "pending", label: "Ожидание", icon: "hourglass" },
              { key: "in_progress", label: "В пути", icon: "bicycle" },
              { key: "completed", label: "Завершён", icon: "checkmark-circle" },
              { key: "service", label: "Услуги", icon: "construct" },
              { key: "booking", label: "Брони", icon: "calendar" },
            ].map((filter) => {
              const isActive = filters.includes(filter.key);
              const config = STATUS_CONFIG[
                filter.key as keyof typeof STATUS_CONFIG
              ] || { color: "#6B7280" };

              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    isActive && [
                      styles.filterButtonActive,
                      {
                        backgroundColor: config.color,
                        borderColor: config.color,
                      },
                    ],
                  ]}
                  onPress={() => toggleFilter(filter.key)}
                >
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={isActive ? "#FFF" : config.color}
                  />
                  <Text
                    variant={isActive ? "r600.14" : "r400.14"}
                    style={{
                      color: isActive ? "#FFF" : "#374151",
                      marginLeft: 6,
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Список заказов */}
        <View style={styles.ordersSection}>
          <Text variant="r600.16" style={styles.sectionTitle}>
            {filteredOrders.length > 0
              ? `Заказы (${filteredOrders.length})`
              : "Заказы"}
          </Text>

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusConfig =
                order.type === "delivery"
                  ? DELIVERY_STATUS_CONFIG[order.status]
                  : STATUS_CONFIG[order.status];
              const orderType = (order as any).type || "delivery";

              return (
                <TouchableOpacity
                  key={order.id}
                  onPress={() =>
                    router.push(`/orders/detail?orderId=${order.id}`)
                  }
                  activeOpacity={0.9}
                >
                  <Card style={styles.orderCard}>
                    {/* Верхняя часть карточки */}
                    <View style={styles.orderHeader}>
                      <View>
                        <View style={styles.orderTitleRow}>
                          <Text variant="r700.16">Заказ #{order.id}</Text>
                          {renderOrderTypeBadge(orderType)}
                        </View>
                        <Text variant="r400.14" color="#6B7280">
                          {new Date(order.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusConfig.bgColor },
                        ]}
                      >
                        <Ionicons
                          name={statusConfig.icon as any}
                          size={12}
                          color={statusConfig.color}
                        />
                        <Text
                          variant="r400.11"
                          style={{ color: statusConfig.color, marginLeft: 4 }}
                        >
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>

                    {/* Информация о поставщике/доставке */}
                    {(order as any).providerName && (
                      <View style={styles.providerInfo}>
                        <Ionicons name="business" size={14} color="#6B7280" />
                        <Text
                          variant="r400.14"
                          color="#6B7280"
                          style={{ marginLeft: 6, flex: 1 }}
                        >
                          {(order as any).providerName}
                        </Text>
                      </View>
                    )}

                    {/* Товары/Услуги */}
                    {/* <View style={styles.itemsContainer}>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                          <Text variant="r400.14" style={{ flex: 1 }}>
                            • {item.name}
                          </Text>
                          <Text variant="r600.14">
                            {item.quantity} × {item.price}₽
                          </Text>
                        </View>
                      ))}
                      {order.items.length > 2 && (
                        <Text
                          variant="r400.13"
                          color="#3B82F6"
                          style={{ marginTop: 4 }}
                        >
                          +{order.items.length - 2} ещё
                        </Text>
                      )}
                    </View> */}

                    {/* Таймлайн статуса */}
                    {renderStatusTimeline(order.status)}

                    {/* Нижняя часть с суммой */}
                    {/* <Divider style={{ marginVertical: 12 }} /> */}

                    <View style={styles.orderFooter}>
                      <View>
                        <Text variant="r400.13" color="#6B7280">
                          {order.status === "completed"
                            ? "Доставлено"
                            : "Ожидаемое время"}
                        </Text>
                        <Text variant="r600.14">
                          {new Date(
                            order.estimatedDeliveryTime,
                          ).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                      <View style={styles.amountContainer}>
                        <Text variant="r400.12" color="#6B7280">
                          Итого
                        </Text>
                        <Text variant="r700.18" color="#111827">
                          {order.totalAmount}₽
                        </Text>
                      </View>
                    </View>

                    {/* Действия */}
                    {/* <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                          name="chatbubble-outline"
                          size={16}
                          color="#3B82F6"
                        />
                        <Text
                          variant="r600.13"
                          color="#3B82F6"
                          style={{ marginLeft: 6 }}
                        >
                          Поддержка
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.primaryAction]}
                      >
                        <Ionicons name="repeat" size={16} color="#FFF" />
                        <Text
                          variant="r600.13"
                          color="#FFF"
                          style={{ marginLeft: 6 }}
                        >
                          Повторить
                        </Text>
                      </TouchableOpacity>
                    </View> */}
                  </Card>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
              <Text variant="r600.18" color="#9CA3AF" style={{ marginTop: 16 }}>
                Заказы не найдены
              </Text>
              <Text
                variant="r400.14"
                color="#9CA3AF"
                style={{ marginTop: 8, textAlign: "center" }}
              >
                Попробуйте изменить фильтры или создайте новый заказ
              </Text>
              <TouchableOpacity style={styles.emptyActionButton}>
                <Text variant="r600.14" color="#FFF">
                  Найти услуги
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Статистика */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Text variant="r700.20" color="#3B82F6">
              ₽{orders.reduce((sum, o) => sum + o.totalAmount, 0)}
            </Text>
            <Text variant="r400.12" color="#6B7280">
              Всего потрачено
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="r700.20" color="#10B981">
              {orders.filter((o) => o.status === "completed").length}
            </Text>
            <Text variant="r400.12" color="#6B7280">
              Завершено
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text variant="r700.20" color="#F59E0B">
              {orders.filter((o) => o.status === "in_progress").length}
            </Text>
            <Text variant="r400.12" color="#6B7280">
              В процессе
            </Text>
          </View>
        </ScrollView> */}
        {/* Быстрые действия */}
        {/* <View style={styles.quickActionsSection}>
          <Text variant="r600.16" style={styles.sectionTitle}>
            Быстрые действия
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#DBEAFE" }]}
              >
                <Ionicons name="add-circle" size={24} color="#3B82F6" />
              </View>
              <Text variant="r600.13" style={{ marginTop: 8 }}>
                Новый заказ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#D1FAE5" }]}
              >
                <Ionicons name="calendar" size={24} color="#10B981" />
              </View>
              <Text variant="r600.13" style={{ marginTop: 8 }}>
                Мои брони
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#FEF3C7" }]}
              >
                <Ionicons name="star" size={24} color="#F59E0B" />
              </View>
              <Text variant="r600.13" style={{ marginTop: 8 }}>
                Оставить отзыв
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: "#F3E8FF" }]}
              >
                <Ionicons name="help-circle" size={24} color="#8B5CF6" />
              </View>
              <Text variant="r600.13" style={{ marginTop: 8 }}>
                Помощь
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterSection: {
    paddingTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    borderWidth: 1,
  },
  ordersSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemsContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  timelineStep: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  timelineLineContainer: {
    alignItems: "center",
    width: "100%",
    position: "relative",
    height: 24,
    justifyContent: "center",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  timelineLine: {
    height: 2,
    backgroundColor: "#E5E7EB",
    zIndex: 1,
  },
  timelineText: {
    alignItems: "center",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  primaryAction: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  emptyActionButton: {
    marginTop: 20,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
