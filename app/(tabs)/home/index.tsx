import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchMockData,
  Provider,
  ServiceCategory,
  Shop,
} from "../../../mocks/mockData";
import { Badge, Card, StarRating, Text } from "../../../shared/components/ui";

export default function HomeScreen() {
  const router = useRouter();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [shopsLoading, setShopsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const servicesData = await fetchMockData("serviceCategories");
        console.log("Loaded service categories:", servicesData);
        setServiceCategories(servicesData);
        setServicesLoading(false);

        const shopsData = await fetchMockData("shopCategories");
        console.log("Loaded shop categories:", shopsData);
        setShopCategories(shopsData);
        setShopsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setServicesLoading(false);
        setShopsLoading(false);
      }
    };
    loadData();
  }, []);

  const renderProvider = (provider: Provider) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.providerCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/search",
          params: { type: "service", providerId: provider.id },
        })
      }
    >
      <Card style={styles.providerCardContent}>
        <Text weight="semibold" size="sm">
          {provider.name}
        </Text>
        <Text size="xs" color="#666666" style={styles.specialization}>
          {provider.specialization}
        </Text>
        <StarRating
          rating={provider.rating}
          count={provider.reviewCount}
          size="small"
        />
        <Text size="sm" weight="bold" style={styles.providerPrice}>
          {provider.price}₽/ч
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderShop = (item: Shop) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.shopCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/main/detail",
          params: { shopId: item.id },
        })
      }
    >
      <View style={styles.shopImageContainer}>
        <Image source={{ uri: item.image }} style={styles.shopImage} />
        <View style={styles.shopBadge}>
          <Text size="xs" weight="bold" color="#FFF">
            ★ {item.rating}
          </Text>
        </View>
      </View>
      <View style={styles.shopInfo}>
        <Text weight="semibold" size="base">
          {item.name}
        </Text>
        <Text size="xs" color="#999999" style={styles.deliveryTime}>
          {item.deliveryTime.min}-{item.deliveryTime.max} мин
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text size="2xl" weight="bold" color="#FFF">
              SuperApp
            </Text>
            <Text size="sm" color="rgba(255,255,255,0.8)">
              Все услуги в одном месте
            </Text>
          </View>
          <TouchableOpacity>
            <View style={styles.notificationIcon}>
              <Ionicons name="notifications" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" />
          <Text color="#999999" style={styles.searchText}>
            Поиск услуг...
          </Text>
        </TouchableOpacity>

        {/* Featured Banner */}
        <View style={styles.section}>
          <View style={styles.featuredBanner}>
            <View>
              <Badge label="Спецпредложение" variant="success" />
              <Text
                size="lg"
                weight="bold"
                color="#FFF"
                style={styles.bannerText}
              >
                Скидка 20%
              </Text>
              <Text size="sm" color="rgba(255,255,255,0.9)">
                на первый заказ
              </Text>
            </View>
            <Ionicons name="gift" size={48} color="#FFF" />
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text size="lg" weight="bold" style={styles.sectionTitle}>
            Услуги
          </Text>
        </View>

        {servicesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9AA9C0" />
            <Text color="#999999" style={{ marginTop: 8 }}>
              Загрузка услуг...
            </Text>
          </View>
        ) : serviceCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text color="#999999">Услуги не найдены</Text>
          </View>
        ) : (
          serviceCategories.map((serviceCategory) => (
            <View key={serviceCategory.id} style={styles.section}>
              <View style={styles.shopCategoryHeader}>
                <View
                  style={[
                    styles.shopCategoryIcon,
                    { backgroundColor: serviceCategory.color },
                  ]}
                >
                  <Ionicons
                    name={
                      serviceCategory.icon as keyof typeof Ionicons.glyphMap
                    }
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View>
                  <Text size="xs" color="#999999" weight="regular">
                    Популярные
                  </Text>
                  <Text
                    size="base"
                    weight="bold"
                    style={styles.shopCategoryTitle}
                  >
                    {serviceCategory.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ marginLeft: "auto" }}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/search",
                      params: { type: "service", category: serviceCategory.id },
                    })
                  }
                >
                  <Text size="sm" color="#9AA9C0" weight="semibold">
                    Все →
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={serviceCategory.providers}
                renderItem={({ item }) => renderProvider(item)}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shopsHorizontalList}
              />
            </View>
          ))
        )}

        {/* Shops Categories */}
        <View style={styles.section}>
          <Text size="lg" weight="bold" style={styles.sectionTitle}>
            Магазины и сервисы
          </Text>
        </View>

        {shopsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9AA9C0" />
            <Text color="#999999" style={{ marginTop: 8 }}>
              Загрузка магазинов...
            </Text>
          </View>
        ) : shopCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text color="#999999">Магазины не найдены</Text>
          </View>
        ) : (
          shopCategories.map((shopCategory) => (
            <View key={shopCategory.id} style={styles.section}>
              <View style={styles.shopCategoryHeader}>
                <View
                  style={[
                    styles.shopCategoryIcon,
                    { backgroundColor: shopCategory.color },
                  ]}
                >
                  <Ionicons
                    name={shopCategory.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View>
                  <Text size="xs" color="#999999" weight="regular">
                    Популярные
                  </Text>
                  <Text
                    size="base"
                    weight="bold"
                    style={styles.shopCategoryTitle}
                  >
                    {shopCategory.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ marginLeft: "auto" }}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/search",
                      params: { type: "shop", category: shopCategory.id },
                    })
                  }
                >
                  <Text size="sm" color="#9AA9C0" weight="semibold">
                    Все →
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={shopCategory.shops}
                renderItem={({ item }) => renderShop(item)}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shopsHorizontalList}
              />
            </View>
          ))
        )}

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 24,
    backgroundColor: "#9AA9C0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    color: "#2B2934",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryButton: {
    width: "22%",
    alignItems: "center",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    textAlign: "center",
    lineHeight: 16,
    color: "#2B2934",
  },
  featuredBanner: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#BCBBC1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#BCBBC1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerText: {
    marginVertical: 8,
    color: "#FFF",
  },
  shopsGrid: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  shopCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  shopImageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
  },
  shopImage: {
    width: "100%",
    height: "100%",
  },
  shopBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(43,41,52,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shopInfo: {
    padding: 12,
  },
  deliveryTime: {
    marginTop: 4,
  },
  footer: {
    height: 20,
  },
  shopCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  shopCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  shopCategoryTitle: {
    color: "#2B2934",
  },
  shopsHorizontalList: {
    paddingRight: 16,
  },
  providerCard: {
    width: 160,
    marginRight: 12,
  },
  providerCardContent: {
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  specialization: {
    marginVertical: 4,
    fontStyle: "italic",
  },
  providerPrice: {
    marginTop: 8,
    color: "#9AA9C0",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
