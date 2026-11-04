import { Button } from "@/shared/components/button";
import { Card } from "@/shared/components/card";
import { Divider } from "@/shared/components/divider";
import { StarRating } from "@/shared/components/star-rating";
import { Text } from "@/shared/components/text";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchMockData, Product, Shop } from "@/shared/mocks/mock-data";

export default function ShopDetailScreen() {
  const router = useRouter();
  const { shopId } = useLocalSearchParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const shopCategories = await fetchMockData("shopCategories");
      const allShops = shopCategories.flatMap((cat: any) => cat.shops);
      const found = allShops.find((s: Shop) => s.id === shopId) || allShops[0];
      setShop(found);

      const productsData = await fetchMockData("products");
      const shopProducts = productsData.filter(
        (p: Product) => p.shopId === shopId,
      );
      setProducts(shopProducts);
      setLoading(false);
    };
    loadData();
  }, [shopId]);

  const renderMenuItem = ({ item }: { item: Product }) => (
    <Card style={styles.menuItem}>
      <View style={styles.itemHeader}>
        <View style={{ flex: 1 }}>
          <Text weight="semibold" size="base">
            {item.name}
          </Text>
          <StarRating rating={item.rating} count={0} size="small" />
        </View>
        <Text weight="bold" size="lg" color="#FF6B6B">
          {item.price}₽
        </Text>
      </View>
      <Button
        title="В корзину"
        variant="primary"
        onPress={() => Alert.alert("Товар добавлен в корзину")}
        style={{ marginTop: 8 }}
      />
    </Card>
  );

  if (loading || !shop) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text size="lg" color="#FF6B6B">
              ← Назад
            </Text>
          </TouchableOpacity>
        </View>

        {/* Shop Image */}
        <Image source={{ uri: shop.image }} style={styles.shopImage} />

        {/* Shop Info */}
        <View style={styles.shopInfo}>
          <Text size="xl" weight="bold">
            {shop.name}
          </Text>
          <View style={styles.ratingContainer}>
            <StarRating
              rating={shop.rating}
              count={shop.reviewCount}
              size="small"
            />
            <Text size="sm" color="#666666" style={{ marginLeft: 8 }}>
              {shop.deliveryTime.min}-{shop.deliveryTime.max} мин
            </Text>
          </View>

          <View style={{ marginVertical: 16 }}>
            <Divider />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text size="sm" color="#666666">
                Время доставки
              </Text>
              <Text size="lg" weight="bold">
                {Math.round(
                  (shop.deliveryTime.min + shop.deliveryTime.max) / 2,
                )}{" "}
                мин
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text size="sm" color="#666666">
                Минимум заказа
              </Text>
              <Text size="lg" weight="bold">
                {shop.minimumOrder}₽
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text size="sm" color="#666666">
                Рейтинг
              </Text>
              <Text size="lg" weight="bold">
                {shop.rating}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={{ marginVertical: 0 }} />

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text size="lg" weight="bold" style={styles.menuTitle}>
            Товары
          </Text>
          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text color="#666666">Товары не найдены</Text>
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
  shopImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  shopInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuTitle: {
    marginBottom: 12,
  },
  menuItem: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
});
