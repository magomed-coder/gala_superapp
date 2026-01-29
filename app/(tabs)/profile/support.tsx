import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Служба поддержки</Text>
      {/* Здесь будет форма или контакты поддержки */}
      <View style={styles.placeholder}>
        <Text color="#999">Свяжитесь с нами по вопросам</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
