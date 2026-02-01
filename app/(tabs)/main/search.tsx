import { GenericBottomSheet, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_RESULTS = [
  { id: 1, type: "service", title: "Ремонт техники", category: "Услуги" },
  { id: 2, type: "shop", title: 'Магазин "Техника+"', category: "Магазины" },
  { id: 3, type: "product", title: "iPhone 15 Pro", category: "Товары" },
  {
    id: 4,
    type: "provider",
    title: "Иван Петров (мастер)",
    category: "Мастера",
  },
  { id: 5, type: "service", title: "Уборка квартир", category: "Услуги" },
];

const FILTER_CATEGORIES = ["Все", "Услуги", "Магазины", "Товары", "Мастера"];

export default function MainSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const filteredResults = MOCK_RESULTS.filter(
    (item) =>
      (selectedCategory === "Все" || item.category === selectedCategory) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        {/* <Text type="h1">Поиск</Text> */}
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#9AA9C0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Поиск по услугам, магазинам, товарам..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => bottomSheetRef.current?.expand()}
        >
          <Ionicons name="options-outline" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        ListEmptyComponent={<Text color="#999">Ничего не найдено</Text>}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Ionicons
              name={
                item.type === "service"
                  ? "construct-outline"
                  : item.type === "shop"
                    ? "storefront-outline"
                    : item.type === "product"
                      ? "cube-outline"
                      : "person-outline"
              }
              size={22}
              color="#3B82F6"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text type="p1">{item.title}</Text>
              <Text type="p2" color="#999">
                {item.category}
              </Text>
            </View>
          </View>
        )}
      />
      <GenericBottomSheet
        ref={bottomSheetRef}
        snapPoints={[320]}
        enablePanDownToClose
        backdropOpacity={0.2}
      >
        <Text type="h2" style={{ marginBottom: 16 }}>
          Фильтры
        </Text>
        <Text type="p1" style={{ marginBottom: 8 }}>
          Категория
        </Text>
        <View style={styles.filterList}>
          {FILTER_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                selectedCategory === cat && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                type="p2"
                color={selectedCategory === cat ? "#FFF" : "#3B82F6"}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => bottomSheetRef.current?.close()}
        >
          <Text type="p1" style={{ color: "#FFF", textAlign: "center" }}>
            Применить
          </Text>
        </TouchableOpacity>
      </GenericBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeBtn: { padding: 8 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 0,
  },
  filterBtn: {
    marginLeft: 12,
    backgroundColor: "#E0E7EF",
    borderRadius: 10,
    padding: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
  filterChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  applyBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
});
