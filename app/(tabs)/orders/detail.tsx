import { Badge, Card, Divider, Text } from "@/components/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, Order } from "../../../mocks/mockData";

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchMockData("orders");
      const found = data.find((o: Order) => o.id === orderId) || data[0];
      setOrder(found);
      setLoading(false);
    };
    loadOrder();
  }, [orderId]);

  const statusConfig = {
    completed: { label: "Завершён", color: "#10B981" },
    in_progress: { label: "В пути", color: "#F59E0B" },
    pending: { label: "Ожидание", color: "#3B82F6" },
    cancelled: { label: "Отменён", color: "#EF4444" },
  };

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text variant="r400.18" color="#FF6B6B">
              ← Назад
            </Text>
          </TouchableOpacity>
          <Text variant="r700.20">Заказ #{order.id}</Text>
        </View>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text variant="r700.18">Заказ от {order.createdAt}</Text>
            <Badge label={statusConfig[order.status].label} variant="success" />
          </View>
        </Card>

        {/* Items */}
        <Card style={styles.itemsCard}>
          <Text variant="r700.18" style={styles.sectionTitle}>
            Товары
          </Text>
          {order.items.map((item, idx) => (
            <View key={idx}>
              <Text
                variant="r400.14"
                color="#333333"
                style={{ paddingVertical: 8 }}
              >
                {item.name} x{item.quantity} - {item.price}₽
              </Text>
              {idx < order.items.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* Total */}
        <Card style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text variant="r700.18">Итого</Text>
            <Text variant="r700.18" color="#FF6B6B">
              {order.totalAmount}₽
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  totalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    marginBottom: 12,
  },
});
