import { Card, Divider, Text } from "@/components/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchMockData,
  Provider,
  ServiceCategory,
  Shop,
  ShopCategory,
} from "../../../mocks/mockData";

export default function CategoryScreen() {
  const router = useRouter();
  const { categoryId, type } = useLocalSearchParams();
  const [items, setItems] = useState<Provider[] | Shop[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (type === "service") {
        const categories = await fetchMockData("serviceCategories");
        const category = categories.find(
          (cat: ServiceCategory) => cat.id === categoryId,
        );
        if (category) {
          setItems(category.providers);
          setCategoryName(category.name);
        }
      } else {
        const categories = await fetchMockData("shopCategories");
        const category = categories.find(
          (cat: ShopCategory) => cat.id === categoryId,
        );
        if (category) {
          setItems(category.shops);
          setCategoryName(category.name);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [categoryId, type]);

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/services/detail",
          params: { providerId: item.id },
        })
      }
    >
      <Card style={styles.itemCard}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text weight="semibold" size="lg">
              {item.name}
            </Text>
            <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
              {item.specialization}
            </Text>
            <View style={styles.ratingContainer}>
              <Text size="sm" weight="semibold">
                ⭐ {item.rating}
              </Text>
              <Text size="sm" color="#666666">
                {" "}
                ({item.reviewCount} отзывов)
              </Text>
            </View>
            <Text size="sm" weight="semibold" style={{ marginTop: 8 }}>
              От {item.price} ₽
            </Text>
          </View>
          <Text size="xl" color="#999999">
            →
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderShop = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/main/detail",
          params: { shopId: item.id },
        })
      }
    >
      <Card style={styles.itemCard}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text weight="semibold" size="lg">
              {item.name}
            </Text>
            <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
              {item.category}
            </Text>
            <View style={styles.ratingContainer}>
              <Text size="sm" weight="semibold">
                ⭐ {item.rating}
              </Text>
              <Text size="sm" color="#666666">
                {" "}
                ({item.reviewCount} отзывов)
              </Text>
            </View>
            <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
              🕒 {item.deliveryTime.min}-{item.deliveryTime.max} мин
            </Text>
          </View>
          <Text size="xl" color="#999999">
            →
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Provider | Shop }) => {
    if (type === "service") {
      return renderProvider({ item: item as Provider });
    } else {
      return renderShop({ item: item as Shop });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text size="lg" color="#FF6B6B">
            ← Назад
          </Text>
        </TouchableOpacity>
        <Text size="2xl" weight="bold" style={{ marginTop: 8 }}>
          {categoryName}
        </Text>
        <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
          {items.length}{" "}
          {type === "service" ? "специалистов" : "доступных мест"}
        </Text>
      </View>

      <Divider />

      <FlatList<Provider | Shop>
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});
