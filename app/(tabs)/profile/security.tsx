import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Безопасность</Text>
      {/* Здесь будут настройки безопасности аккаунта */}
      <View style={styles.placeholder}>
        <Text color="#999">Настройки безопасности</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
