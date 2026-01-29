import { Text } from "@/components/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text type="h1">Избранное</Text>
      {/* Здесь будет список избранных товаров/услуг */}
      <View style={styles.placeholder}>
        <Text color="#999">Нет избранного</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});
