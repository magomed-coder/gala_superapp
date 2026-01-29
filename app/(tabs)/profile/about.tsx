import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">О приложении</Text>
      {/* Здесь будет информация о приложении, версия, контакты */}
      <View style={styles.placeholder}>
        <Text color="#999">Версия 1.0.0 • 2024</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
