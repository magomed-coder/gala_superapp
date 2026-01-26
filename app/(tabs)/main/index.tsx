import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { IS_IOS } from "@/constants/config.constants";
import {
  fetchMockData,
  PromoBanner,
  Provider,
  QuickAction,
  ServiceCategory,
  Shop,
} from "../../../mocks/mockData";
import { Badge, StarRating, Text } from "../../../shared/components/ui";

// ────────────────────────────────────────────────
const HEADER_FULL_HEIGHT = 130;
const SEARCH_HEIGHT = 56;
const HEADER_MIN_HEIGHT = HEADER_FULL_HEIGHT - SEARCH_HEIGHT;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PROMO_HORIZONTAL_PADDING = 32;
const PROMO_ITEM_WIDTH = SCREEN_WIDTH - PROMO_HORIZONTAL_PADDING;
const PROMO_ITEM_SPACING = 4;
const PROMO_SIDE_PADDING = (SCREEN_WIDTH - PROMO_ITEM_WIDTH) / 2;

// ────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const stickyHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
  const paddedContentTop = stickyHeaderHeight + (IS_IOS ? 20 : 50);

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [],
  );
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  // Refs
  const promoFlatListRef = useRef<FlatList>(null);

  // Reanimated
  const scrollY = useSharedValue(0);
  const lastY = useSharedValue(0);
  const searchOffset = useSharedValue(0);
  const promoScrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const dy = y - lastY.value;
      if (dy < 0) {
        searchOffset.value = withTiming(0);
      } else if (dy > 0 && y > 0) {
        searchOffset.value = withTiming(-SEARCH_HEIGHT);
      }
      lastY.value = y;
      scrollY.value = y;
    },
  });

  const promoScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      promoScrollX.value = event.contentOffset.x;
    },
  });

  const searchTranslateY = useAnimatedStyle(() => ({
    transform: [{ translateY: searchOffset.value }],
  }));

  const contentTranslateY = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollY.value,
      [0, SEARCH_HEIGHT],
      [0, -SEARCH_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY: translate }] };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const servicesData = await fetchMockData("serviceCategories");
        setServiceCategories(servicesData);
        setServicesLoading(false);

        const shopsData = await fetchMockData("shopCategories");
        setShopCategories(shopsData);
        setShopsLoading(false);

        const promos = await fetchMockData("promoBanners");
        setPromoBanners(promos);

        const actions = await fetchMockData("quickActions");
        setQuickActions(actions);
      } catch (error) {
        console.error("Error loading data:", error);
        setServicesLoading(false);
        setShopsLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── Промо-свайпер ───
  const renderPromoBanner = ({
    item,
  }: {
    item: PromoBanner;
    index: number;
  }) => {
    return (
      <View style={[styles.promoSlide, { width: PROMO_ITEM_WIDTH }]}>
        <LinearGradient
          colors={item.gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoBanner}
        >
          <View style={styles.promoContent}>
            <Badge label={item.badge} variant="primary" />
            <Text
              size="xl"
              weight="bold"
              color="#FFF"
              style={styles.promoTitle}
            >
              {item.title}
            </Text>
            <Text size="sm" color="rgba(255,255,255,0.9)">
              {item.description}
            </Text>
            <TouchableOpacity
              style={styles.promoButton}
              onPress={() => {
                console.log(`Promo ${item.id} clicked`);
              }}
            >
              <Text size="sm" weight="bold" color="#FFF">
                {item.buttonText}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons
              name={item.icon as any}
              size={60}
              color={item.iconColor}
            />
          </View>
        </LinearGradient>
      </View>
    );
  };

  const handlePromoScroll = (event: any) => {
    const slideSize = SCREEN_WIDTH - PROMO_HORIZONTAL_PADDING;
  };

  const renderProvider = (provider: Provider) => {
    return (
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
        <View style={styles.providerCardContent}>
          <View style={styles.providerHeader}>
            <View style={styles.providerInfo}>
              <Text weight="semibold" size="sm" numberOfLines={1}>
                {provider.name}
              </Text>
              <Text size="xs" color="#666" style={styles.specialization}>
                {provider.specialization}
              </Text>
            </View>
          </View>

          <View style={styles.providerRatingContainer}>
            <StarRating
              rating={provider.rating}
              count={provider.reviewCount}
              size="small"
            />
          </View>

          <View style={styles.providerFooter}>
            <Text size="xs" color="#666">
              от
            </Text>
            <Text size="lg" weight="bold" style={styles.providerPrice}>
              {provider.price}₽
            </Text>
            <Text size="xs" color="#666">
              /ч
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Image
          source={{ uri: item.image }}
          style={styles.shopImage}
          resizeMode="cover"
        />
        <View style={styles.shopBadgeContainer}>
          <View style={styles.shopRatingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text
              size="xs"
              weight="bold"
              color="#FFF"
              style={styles.ratingText}
            >
              {item.rating}
            </Text>
          </View>
        </View>
        {item.isPromoted && (
          <View style={styles.promotedBadgeContainer}>
            <Badge label="TOP" variant="primary" />
          </View>
        )}
      </View>
      <View style={styles.shopInfo}>
        <Text weight="semibold" size="base" numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.shopDetails}>
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text size="xs" color="#999" style={styles.deliveryTime}>
              {item.deliveryTime.min}-{item.deliveryTime.max} мин
            </Text>
          </View>
          {item.freeDelivery && <Badge label="Бесплатно" variant="success" />}
        </View>
      </View>
    </TouchableOpacity>
  );

  // ────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Sticky header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top + 12, height: stickyHeaderHeight },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text size="3xl" weight="bold" color="#000">
              ġala
            </Text>
            <Text size="sm" color="#000">
              Город в твоих руках
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person-circle-outline" size={32} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Поиск */}
      <Animated.View
        style={[
          styles.searchContainer,
          { top: stickyHeaderHeight },
          searchTranslateY,
        ]}
      >
        <TouchableOpacity style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#9AA9C0" />
          </View>
          <Text color="#999" style={styles.searchText}>
            Поиск услуг и магазинов...
          </Text>
          <View style={styles.searchFilter}>
            <Ionicons name="options-outline" size={20} color="#9AA9C0" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: paddedContentTop,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={contentTranslateY}>
          {/* Promo Swiper */}
          <View style={[styles.promoSection]}>
            {/* можно добавить небольшой отступ */}
            <Animated.FlatList
              ref={promoFlatListRef}
              data={promoBanners}
              renderItem={renderPromoBanner}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={promoScrollHandler}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handlePromoScroll}
              decelerationRate="fast"
              snapToInterval={PROMO_ITEM_WIDTH + PROMO_ITEM_SPACING}
              snapToAlignment="start"
              ItemSeparatorComponent={() => (
                <View style={{ width: PROMO_ITEM_SPACING }} />
              )}
              contentContainerStyle={{ paddingHorizontal: PROMO_SIDE_PADDING }}
            />
          </View>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActions}
            >
              {quickActions.map((action) => (
                <TouchableOpacity key={action.id} style={styles.quickAction}>
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color="#FFF"
                    />
                  </View>
                  <Text
                    size="xs"
                    weight="semibold"
                    style={styles.quickActionText}
                  >
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.ScrollView>
          </View>
          {/* Услуги - новый дизайн заголовка */}{" "}
          {/* <View style={styles.section}>
            <View style={styles.titleSection}>
              <Text size="2xl" weight="bold" style={styles.mainTitle}>
                Услуги
              </Text>
              <Text size="sm" color="#666" style={styles.subtitle}>
                Найдите проверенных мастеров
              </Text>
            </View>
          </View> */}
          {servicesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9AA9C0" />
              <Text color="#999" style={{ marginTop: 12 }}>
                Загрузка услуг...
              </Text>
            </View>
          ) : serviceCategories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="construct-outline" size={48} color="#CCC" />
              <Text color="#999" style={{ marginTop: 12 }}>
                Услуги временно недоступны
              </Text>
            </View>
          ) : (
            serviceCategories.map((category) => (
              <View key={category.id} style={styles.section}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryTitleContainer}>
                    <LinearGradient
                      colors={[category.color, category.color + "CC"]}
                      style={styles.categoryIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name={category.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color="#FFF"
                      />
                    </LinearGradient>
                    <View>
                      <Text
                        size="base"
                        weight="bold"
                        style={styles.categoryName}
                      >
                        {category.name}
                      </Text>
                      <Text size="xs" color="#999" weight="regular">
                        {category.providers.length} мастеров
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/search",
                        params: { type: "service", category: category.id },
                      })
                    }
                  >
                    <Text size="sm" color="#9AA9C0" weight="semibold">
                      Все
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9AA9C0"
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={category.providers.slice(0, 5)}
                  renderItem={({ item }) => renderProvider(item)}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            ))
          )}
          {/* Популярные магазины - новый дизайн заголовка */}
          {/* <View style={styles.section}>
            <View style={styles.titleSection}>
              <Text size="2xl" weight="bold" style={styles.mainTitle}>
                Магазины и сервисы
              </Text>
              <Text size="sm" color="#666" style={styles.subtitle}>
                Доставка и самовывоз рядом с вами
              </Text>
            </View>
          </View> */}
          {shopsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9AA9C0" />
              <Text color="#999" style={{ marginTop: 12 }}>
                Загрузка магазинов...
              </Text>
            </View>
          ) : shopCategories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color="#CCC" />
              <Text color="#999" style={{ marginTop: 12 }}>
                Магазины не найдены
              </Text>
            </View>
          ) : (
            shopCategories.map((shopCategory) => (
              <View key={shopCategory.id} style={styles.section}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryTitleContainer}>
                    <LinearGradient
                      colors={[shopCategory.color, shopCategory.color + "CC"]}
                      style={styles.categoryIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name={
                          shopCategory.icon as keyof typeof Ionicons.glyphMap
                        }
                        size={20}
                        color="#FFF"
                      />
                    </LinearGradient>
                    <View>
                      <Text
                        size="base"
                        weight="bold"
                        style={styles.categoryName}
                      >
                        {shopCategory.name}
                      </Text>
                      <Text size="xs" color="#999" weight="regular">
                        {shopCategory.shops.length} магазинов
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/search",
                        params: { type: "shop", category: shopCategory.id },
                      })
                    }
                  >
                    <Text size="sm" color="#9AA9C0" weight="semibold">
                      Все
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9AA9C0"
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={shopCategory.shops.slice(0, 5)}
                  renderItem={({ item }) => renderShop(item)}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            ))
          )}
          <View style={styles.footer} />
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  // ─── Sticky header ───
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: "rgba(248, 249, 250, 0.96)",
    zIndex: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4757",
    borderWidth: 1,
    borderColor: "#FFF",
  },

  // ─── Поисковая строка ───
  searchContainer: {
    position: "absolute",
    top: HEADER_MIN_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 90,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#F8F9FA",
  },

  searchBar: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    marginRight: 12,
  },

  searchText: {
    flex: 1,
  },

  searchFilter: {
    marginLeft: 12,
  },

  // ─── Promo Swiper ───
  promoSection: {
    position: "relative",
    height: 200,
    marginBottom: 0, // можно вернуть этот отступ
  },

  promoSlide: {
    height: 180,
    justifyContent: "center",
  },

  promoBanner: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  promoContent: {
    flex: 1,
    zIndex: 2,
  },

  promoTitle: {
    marginTop: 8,
    marginBottom: 4,
  },

  promoButton: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  promoIcon: {
    opacity: 0.8,
    zIndex: 1,
  },

  promoIndicators: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },

  promoIndicator: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 4,
    marginHorizontal: 2,
  },

  // ─── Новый дизайн заголовков ───
  titleSection: {
    // justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 16,
  },

  titleDecoration: {
    marginRight: 16,
    alignItems: "center",
  },

  titleLine: {
    width: 4,
    height: 24,
    backgroundColor: "#667eea",
    borderRadius: 2,
    marginBottom: 4,
  },

  titleDot: {
    width: 8,
    height: 8,
    backgroundColor: "#667eea",
    borderRadius: 4,
  },

  mainTitle: {
    color: "#1A1A1A",
    marginBottom: 4,
  },

  subtitle: {
    marginBottom: 0,
  },

  titleAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 12,
  },

  // ─── Общие секции ───
  section: {
    marginBottom: 32,
  },

  // ─── Быстрые действия ───
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },

  quickAction: {
    alignItems: "center",
  },

  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  quickActionText: {
    color: "#1A1A1A",
  },

  // ─── Заголовок категории ───
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryName: {
    color: "#1A1A1A",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
  },

  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },

  // ─── Карточка мастера ───
  providerCard: {
    width: 180,
    marginRight: 12,
  },

  providerCardContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },

  providerHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },

  providerAvatarContainer: {
    marginRight: 12,
  },

  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },

  avatarPlaceholder: {
    backgroundColor: "#667EEA",
    justifyContent: "center",
    alignItems: "center",
  },

  providerInfo: {
    flex: 1,
  },

  specialization: {
    marginTop: 2,
  },

  providerRatingContainer: {
    marginBottom: 12,
  },

  providerFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  providerPrice: {
    color: "#667eea",
  },

  // ─── Карточка магазина ───
  shopCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
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

  shopBadgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },

  shopRatingBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  ratingText: {
    marginLeft: 2,
  },

  promotedBadgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
  },

  shopInfo: {
    padding: 16,
  },

  shopDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  deliveryTime: {
    marginLeft: 2,
  },

  // ─── Состояния загрузки ───
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    height: 40, // ← уменьшите или уберите если не нужен отступ внизу
  },
});
