import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1" style={styles.title}>
        О приложении
      </Text>
      <View style={styles.section}>
        <Text type="p1">SuperApp Che</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          Версия 1.0.0 • 2024
        </Text>
      </View>
      <View style={styles.section}>
        <Text type="p1">Разработчик</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          cupicom.ru
        </Text>
      </View>
      <View style={styles.section}>
        <Text type="p1">Контакты</Text>
        <Text type="p2" color="#999" style={styles.desc}>
          support@example.com
        </Text>
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
});
