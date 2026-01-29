import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockNotifications = [
  { id: 1, title: "Ваша заявка принята", date: "Сегодня, 10:15", read: false },
  { id: 2, title: "Заказ #123 выполнен", date: "Вчера, 18:40", read: true },
  { id: 3, title: "Новый промокод на скидку!", date: "25.01.2026", read: true },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1" style={styles.title}>
        Уведомления
      </Text>
      <View style={styles.list}>
        {mockNotifications.length === 0 ? (
          <View style={styles.placeholder}>
            <Text color="#999">Нет уведомлений</Text>
          </View>
        ) : (
          mockNotifications.map((n) => (
            <View
              key={n.id}
              style={[styles.notification, !n.read && styles.unread]}
            >
              <Text type="p1" style={styles.notificationTitle}>
                {n.title}
              </Text>
              <Text type="p2" color="#999" style={styles.notificationDate}>
                {n.date}
              </Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  title: { marginBottom: 20 },
  list: { flex: 1 },
  notification: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  notificationTitle: { marginBottom: 4 },
  notificationDate: { fontSize: 12 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
