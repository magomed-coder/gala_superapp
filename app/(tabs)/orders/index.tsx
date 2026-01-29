import { Badge, Card, Divider, Text } from "@/components/ui";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, type Order } from "../../../mocks/mockData";

const statusConfig = {
  completed: { label: "Завершён", color: "#10B981" },
  in_progress: { label: "В пути", color: "#F59E0B" },
  pending: { label: "Ожидание", color: "#3B82F6" },
};

const statusSteps = {
  pending: [true, false, false],
  in_progress: [true, true, false],
  completed: [true, true, true],
};

export default function OrdersScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<string[]>(["all"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchMockData("orders");
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, []);

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

  const renderProgressBar = (status: Order["status"]) => {
    const steps = statusSteps[status] || [true, false, false];
    return (
      <View style={styles.progressBar}>
        {["Принято", "Готовится", "В пути"].map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: steps[index]
                    ? statusConfig[status].color
                    : "#E5E7EB",
                },
              ]}
            >
              <Text
                size="xs"
                weight="bold"
                color={steps[index] ? "#FFF" : "#000"}
              >
                {index + 1}
              </Text>
            </View>
            <Text size="xs" style={styles.stepLabel}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text size="xl" weight="bold">
            Мои заказы
          </Text>
          <Text size="sm" color="#666666">
            Отслеживайте статус ваших заказов
          </Text>
        </View>

        {/* Фильтры */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {["all", "pending", "in_progress", "completed"].map((filter) => {
            const isActive = filters.includes(filter);
            const label =
              filter === "all"
                ? "Все"
                : statusConfig[filter as Order["status"]]?.label || filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
                onPress={() => toggleFilter(filter)}
              >
                <Text
                  size="sm"
                  weight={isActive ? "semibold" : "regular"}
                  color={isActive ? "#FFF" : "#666666"}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Список заказов */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => router.push(`/orders/detail?orderId=${order.id}`)}
            >
              <Card style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold" size="lg">
                      Заказ {order.id}
                    </Text>
                    <Text size="sm" color="#666666">
                      {order.createdAt}
                    </Text>
                  </View>
                  <Badge
                    label={statusConfig[order.status].label}
                    variant="primary"
                  />
                </View>

                <Divider />

                {/* Товары */}
                <View style={styles.itemsContainer}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} size="sm" color="#666666">
                      • {item.name} x{item.quantity}
                    </Text>
                  ))}
                </View>

                {/* Прогресс */}
                {renderProgressBar(order.status)}

                <Divider />

                {/* Сумма */}
                <View style={styles.orderFooter}>
                  <View style={{ flex: 1 }}>
                    <Text size="sm" color="#666666">
                      Доставка: {order.estimatedDeliveryTime}
                    </Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text weight="bold" size="lg">
                      {order.totalAmount}₽
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text size="lg" weight="semibold" color="#999999">
              Нет заказов
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  orderCard: {
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemsContainer: {
    marginVertical: 12,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 12,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepLabel: {
    maxWidth: 60,
    textAlign: "center",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});
