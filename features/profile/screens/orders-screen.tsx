import { Text } from "@/shared/components/text";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Мои заказы</Text>
      {/* Здесь будет список заказов пользователя */}
      <View style={styles.placeholder}>
        <Text color="#999">Нет заказов</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
