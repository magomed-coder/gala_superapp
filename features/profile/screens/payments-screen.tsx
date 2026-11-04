import { Text } from "@/shared/components/text";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Платежные методы</Text>
      {/* Здесь будет список карт и способов оплаты */}
      <View style={styles.placeholder}>
        <Text color="#999">Нет добавленных карт</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
