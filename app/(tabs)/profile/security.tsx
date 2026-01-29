import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1" style={styles.title}>
        Безопасность
      </Text>
      <View style={styles.section}>
        <Text type="p1" style={styles.label}>
          Сменить пароль
        </Text>
        <Text type="p2" color="#999" style={styles.desc}>
          Рекомендуем использовать сложный пароль
        </Text>
        <View style={styles.actionRow}>
          <Text type="p2" color="#3B82F6" style={styles.actionBtn}>
            Изменить
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text type="p1" style={styles.label}>
          Двухфакторная аутентификация
        </Text>
        <Text type="p2" color="#999" style={styles.desc}>
          Включите для повышения безопасности
        </Text>
        <View style={styles.actionRow}>
          <Text type="p2" color="#3B82F6" style={styles.actionBtn}>
            Включить
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  title: { marginBottom: 20 },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  label: { marginBottom: 4 },
  desc: { marginBottom: 8 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end" },
  actionBtn: { fontWeight: "bold" },
});
