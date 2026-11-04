import { Text } from "@/shared/components/text";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1" style={styles.title}>
        Служба поддержки
      </Text>
      <View style={styles.section}>
        <Text type="p1">Чат с поддержкой</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          Операторы онлайн с 9:00 до 21:00
        </Text>
        <View style={styles.actionRow}>
          <Text type="p2" color="#3B82F6" style={styles.actionBtn}>
            Открыть чат
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text type="p1">Телефон</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          +7 (800) 123-45-67
        </Text>
        <View style={styles.actionRow}>
          <Text type="p2" color="#3B82F6" style={styles.actionBtn}>
            Позвонить
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text type="p1">Email</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          support@example.com
        </Text>
        <View style={styles.actionRow}>
          <Text type="p2" color="#3B82F6" style={styles.actionBtn}>
            Написать
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
  desc: { marginBottom: 8 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end" },
  actionBtn: { fontWeight: "bold" },
});
