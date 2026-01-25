import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, Shop } from "../../../mocks/mockData";
import { Card, Input, StarRating, Text } from "../../../shared/components/ui";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Продукты", "Электроника", "Одежда", "Косметика"];

  useEffect(() => {
    const loadShops = async () => {
      const data = await fetchMockData("shopCategories");
      setShops(data);
      setLoading(false);
    };
    loadShops();
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesSearch = shop.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || shop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, shops]);

  const renderShop = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/main/detail",
          params: { shopId: item.id },
        })
      }
    >
      <Card style={styles.shopCard}>
        <Image source={{ uri: item.image }} style={styles.shopImage} />
        <Text weight="semibold" size="base">
          {item.name}
        </Text>
        <View style={styles.shopInfo}>
          <StarRating
            rating={item.rating}
            count={item.reviewCount}
            size="small"
          />
          <Text size="xs" color="#666666">
            {item.deliveryTime.min}-{item.deliveryTime.max} мин
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/search/results",
        params: { query: searchQuery },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text size="xl" weight="bold">
            Поиск
          </Text>
          <Text size="sm" color="#666666">
            Найди свой магазин
          </Text>
        </View>

        <Input
          placeholder="Поиск магазина..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />

        <View style={styles.filterContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                size="sm"
                weight={selectedCategory === category ? "semibold" : "regular"}
                color={selectedCategory === category ? "#FFFFFF" : "#666666"}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resultsHeader}>
          <Text size="sm" color="#666666">
            Найдено: {filteredShops.length} магазинов
          </Text>
        </View>

        {filteredShops.length > 0 ? (
          <FlatList
            data={filteredShops}
            renderItem={renderShop}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text size="lg" weight="semibold">
              Ничего не найдено
            </Text>
            <Text size="sm" color="#666666" style={{ marginTop: 8 }}>
              Попробуйте другой поисковый запрос
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  searchInput: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  resultsHeader: {
    marginBottom: 12,
  },
  shopCard: {
    marginBottom: 12,
  },
  shopImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  shopInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
});
