import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Уведомления</Text>
      {/* Здесь будет список уведомлений пользователя */}
      <View style={styles.placeholder}>
        <Text color="#999">Нет уведомлений</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
