import { Card, Divider, Text } from "@/components/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, Shop } from "../../../mocks/mockData";

export default function TransportResultsScreen() {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const [transports, setTransports] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransports = async () => {
      const data = await fetchMockData("shops");
      setTransports(data);
      setLoading(false);
    };
    loadTransports();
  }, []);

  const filteredResults = useMemo(() => {
    return transports.filter((item) =>
      item.name.toLowerCase().includes((query as string)?.toLowerCase() || ""),
    );
  }, [transports, query]);

  const renderResult = ({ item }: { item: Shop }) => (
    <Card style={styles.resultCard}>
      <View style={styles.resultContent}>
        <View style={{ flex: 1 }}>
          <Text weight="semibold" size="lg">
            {item.name}
          </Text>
          <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
            {item.category} • {item.deliveryTime.min}-{item.deliveryTime.max}{" "}
            мин
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/main/detail",
              params: { shopId: item.id },
            })
          }
        >
          <Text size="sm" color="#FF6B6B" weight="semibold">
            Открыть
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text size="lg" color="#FF6B6B">
              ← Назад
            </Text>
          </TouchableOpacity>
          <Text size="xl" weight="bold" style={{ marginTop: 8 }}>
            Результаты перевозок
          </Text>
          <Text size="sm" color="#666666">
            Найдено: {filteredResults.length} результатов
          </Text>
        </View>

        <Divider />

        {/* Results */}
        <View style={styles.resultsContainer}>
          {filteredResults.length > 0 ? (
            <FlatList
              data={filteredResults}
              renderItem={renderResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text size="lg" weight="semibold">
                Ничего не найдено
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
});
