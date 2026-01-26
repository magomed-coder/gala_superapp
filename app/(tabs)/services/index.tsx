import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchMockData,
  ServiceCategory,
  ShopCategory,
} from "../../../mocks/mockData";
import { Card, Text } from "../../../shared/components/ui";

export default function ServicesScreen() {
  const router = useRouter();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const services = await fetchMockData("serviceCategories");
      const shops = await fetchMockData("shopCategories");
      setServiceCategories(services);
      setShopCategories(shops);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const getIconImage = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      construct: require("../../../assets/imgs/handyAndRepair.png"),
      medical: require("../../../assets/imgs/doc.png"),
      pharm: require("../../../assets/imgs/pharm.png"),
      gift: require("../../../assets/imgs/gift.png"),
      bag: require("../../../assets/imgs/bag.png"),
      restaurant: require("../../../assets/imgs/restaurant.png"),
      car: require("../../../assets/imgs/car.png"),
      bed: require("../../../assets/imgs/hotel.png"),
      map: require("../../../assets/imgs/tour.png"),
      cut: require("../../../assets/imgs/cut.png"),
      sparkles: require("../../../assets/imgs/cleaning.png"),
      water: require("../../../assets/imgs/dryclean.png"),
      "car-sport": require("../../../assets/imgs/autorepair.png"),
      settings: require("../../../assets/imgs/autoparts.png"),
      shirt: require("../../../assets/imgs/clothes.png"),
      phone: require("../../../assets/imgs/phone.png"),
      "car-outline": require("../../../assets/imgs/cars.png"),
      sports_nutrition: require("../../../assets/imgs/sports_nutrition.png"),
    };
    return iconMap[icon] || require("../../../assets/imgs/default.png");
  };

  function renderCategoryCard(
    item: ServiceCategory | ShopCategory,
    type: "service" | "shop",
  ) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.categoryCard}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/services/category",
            params: { categoryId: item.id, type },
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
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}
            >
              {item.name}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 16 }}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Все услуги</Text>
          <Text style={{ fontSize: 14, color: "#666666", marginTop: 4 }}>
            Выберите нужную категорию
          </Text>
        </View>

        {/* Услуги */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Услуги</Text>
            <Text style={{ fontSize: 14, color: "#666666" }}>
              {serviceCategories.length} категорий
            </Text>
          </View>
          <View style={styles.grid}>
            {serviceCategories.map((item) =>
              renderCategoryCard(item, "service"),
            )}
          </View>
        </View>

        {/* Магазины и сервисы */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Магазины и сервисы
            </Text>
            <Text style={{ fontSize: 14, color: "#666666" }}>
              {shopCategories.length} категорий
            </Text>
          </View>
          <View style={styles.grid}>
            {shopCategories.map((item) => renderCategoryCard(item, "shop"))}
          </View>
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
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryCard: {
    width: "48%",
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
  },
});
