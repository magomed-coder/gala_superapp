import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
<<<<<<< HEAD
=======
  FlatList,
  Image,
>>>>>>> 3e08d22 (- сделал иконку для аптеки)
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { fetchMockData, ServiceCategory } from "../../../mocks/mockData";
import { Text } from "../../../shared/components/ui";

export default function ServicesScreen() {
  const router = useRouter();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const serviceData = await fetchMockData("serviceCategories");
      setServiceCategories(serviceData);

      const shopData = await fetchMockData("shopCategories");
      setShopCategories(shopData);

      setLoading(false);
    };
    loadServices();
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
  const renderServiceCategory = (category: ServiceCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryItem}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/search",
          params: { type: "service", category: category.id },
        })
      }
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color="#FFF"
        />
      </View>
      <View style={styles.categoryContent}>
        <Text size="base" weight="semibold" color="#2B2934">
          {category.name}
        </Text>
        <Text size="xs" color="#999999">
          {category.providers.length} специалистов
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9AA9C0" />
    </TouchableOpacity>
  );
=======
  const getIconEmoji = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      wrench: "🔧",
      construct: "🛠️", // Изменено с "tools"
      medical: "👨‍⚕️",
      gift: "🎁",
      bag: "🛍️",
      restaurant: "🍽️",
      car: "🚕",
      bed: "🏨",
      map: "🗺️",
=======
  const getIconImage = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      construct: require("../../../assets/imgs/handyAndRepair.png"),
      medical: require("../../../assets/imgs/doc.png"),
      pharm: require("../../../assets/imgs/pharm.png"),
      gift: require("../../../assets/imgs/gift.png"),
      bag: require("../../../assets/imgs/bag.png"),
      restaurant: require("../../../assets/imgs/restaurant.png"),
      car: require("../../../assets/imgs/taxi.png"),
      bed: require("../../../assets/imgs/hotel.png"),
      map: require("../../../assets/imgs/tour.png"),
>>>>>>> 3e08d22 (- сделал иконку для аптеки)
    };
    return iconMap[icon] || require("../../../assets/imgs/default.png");
  };
>>>>>>> 40bffbf (- поменял навигация категории)

<<<<<<< HEAD
  const renderShopCategory = (shopCategory: any) => (
    <TouchableOpacity
      key={shopCategory.id}
      style={styles.categoryItem}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/search",
          params: { type: "shop", category: shopCategory.id },
        })
      }
    >
      <View
        style={[styles.categoryIcon, { backgroundColor: shopCategory.color }]}
      >
        <Ionicons
          name={shopCategory.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color="#FFF"
        />
      </View>
      <View style={styles.categoryContent}>
        <Text size="base" weight="semibold" color="#2B2934">
          {shopCategory.name}
        </Text>
        <Text size="xs" color="#999999">
          {shopCategory.shops.length} мест
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9AA9C0" />
    </TouchableOpacity>
  );
=======
  const renderCategory = ({ item }: { item: AllCategory }) => {
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/services/category",
            params: { categoryId: item.id, type: item.type },
          })
        }
        activeOpacity={0.7}
      >
        <Card
          style={
            StyleSheet.flatten([
              styles.categoryCardContent,
              { backgroundColor: item.color },
            ]) as ViewStyle
          }
        >
          <Image
            source={getIconImage(item.icon)}
            style={styles.iconBackground}
            resizeMode="contain"
          />
          <View style={styles.categoryInfo}>
            <Text weight="bold" size="base" color="#FFFFFF">
              {item.name}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
>>>>>>> 3e08d22 (- сделал иконку для аптеки)

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      <ScrollView
=======
      <View style={styles.header}>
        <Text size="2xl" weight="bold">
          Все услуги
        </Text>
        <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
          Выберите нужную категорию
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
>>>>>>> 3e08d22 (- сделал иконку для аптеки)
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text size="xl" weight="bold" color="#2B2934">
            Все услуги и магазины
          </Text>
          <Text size="sm" color="#999999">
            Выберите нужную категорию
          </Text>
        </View>

        {/* All Categories Section */}
        <View style={styles.categoriesList}>
          {serviceCategories.map((category) => renderServiceCategory(category))}
          {shopCategories.map((shopCategory) =>
            renderShopCategory(shopCategory),
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 24,
  },
<<<<<<< HEAD
  sectionTitle: {
    marginTop: 20,
=======
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
>>>>>>> 3e08d22 (- сделал иконку для аптеки)
    marginBottom: 12,
    color: "#2B2934",
  },
<<<<<<< HEAD
  categoriesList: {
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
=======
  categoryCard: {
    flex: 1,
    maxWidth: "48%",

    height: 120,
  },
  categoryCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  iconBackground: {
    position: "absolute",
    width: 80,
    height: 80,
    top: 5,
    right: -10,
  },
  categoryInfo: {
    zIndex: 10,
>>>>>>> 3e08d22 (- сделал иконку для аптеки)
  },
});
