import { OrderCard } from "@/features/orders/components/order-card";
import {
  OrderAction,
  OrdersSkeleton,
  OrderState,
} from "@/features/orders/components/order-states";
import { useDemoOrders } from "@/features/orders/hooks/use-demo-orders";
import {
  filterOrders,
  orderFilters,
  type OrderFilter,
} from "@/features/orders/utils/order-presentation";
import { AppFooter } from "@/shared/components/app-footer";
import { useScrollChromeController } from "@/shared/lib/navigation/use-scroll-chrome-controller";
import { useAppTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/tabs";
import { useRef, useState, type ComponentRef } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { Order } from "@/shared/mocks/mock-data";
import Animated from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/** Показывает заказы из общего демоисточника; фильтр живёт только во вкладке. */
export default function OrdersScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [filtersHeight, setFiltersHeight] = useState(
    44 + theme.spacing.xs + theme.spacing.md,
  );
  const { onScroll, headerStyle, reset } =
    useScrollChromeController(filtersHeight);
  const list = useRef<FlatList<Order>>(null);
  const filterBar = useRef<ComponentRef<typeof ScrollView>>(null);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const { data, isPending, isFetching, isError, refetch } = useDemoOrders();
  const orders = filterOrders(data ?? [], filter);

  /** Меняет статусный фильтр и возвращает список к первому подходящему заказу. */
  const selectFilter = (value: OrderFilter) => {
    setFilter(value);
    reset();
    list.current?.scrollToOffset({ offset: 0, animated: false });
    if (value === "all") {
      filterBar.current?.scrollTo({ x: 0, animated: false });
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}
    >
      {/* Виртуализированный список сохраняет содержимое при обновлении и его ошибке. */}
      <Animated.FlatList
        ref={list}
        testID="orders-list"
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        data={orders}
        keyExtractor={(order) => order.id}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          // Постоянные отступы под обе панели исключают скачки карточек при их скрытии.
          paddingTop: filtersHeight,
          paddingBottom: tabBarHeight + theme.spacing.lg,
          gap: theme.spacing.sm,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            progressViewOffset={filtersHeight}
            refreshing={isFetching && data !== undefined}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/orders/detail",
                params: { orderId: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          isPending ? (
            <OrdersSkeleton />
          ) : isError && data === undefined ? (
            <OrderState
              title="Не удалось загрузить заказы"
              description="Попробуйте ещё раз чуть позже."
              error
              action={
                <OrderAction
                  label="Повторить"
                  onPress={() => {
                    void refetch();
                  }}
                  disabled={isFetching}
                />
              }
            />
          ) : (
            <OrderState
              title={
                filter === "all"
                  ? "Здесь будут ваши заказы"
                  : "Таких заказов пока нет"
              }
              description={
                filter === "all"
                  ? "Выберите услугу в каталоге — ваши заказы появятся здесь."
                  : "Попробуйте другой фильтр или откройте все заказы."
              }
              action={
                <OrderAction
                  label={
                    filter === "all"
                      ? "Перейти в каталог"
                      : "Показать все заказы"
                  }
                  onPress={() =>
                    filter === "all"
                      ? router.navigate("/(tabs)/services")
                      : selectFilter("all")
                  }
                />
              }
            />
          )
        }
        ListFooterComponent={
          data && data.length > 0 && orders.length > 0 ? (
            <AppFooter
              style={{
                // Вместе с gap списка даёт spacing.lg над логотипом, как в профиле.
                paddingTop: theme.spacing.lg - theme.spacing.sm,
                paddingBottom: theme.spacing.xs,
              }}
            />
          ) : undefined
        }
      />
      {/* Фильтры уходят за верхнюю границу; измеренная высота учитывает системный шрифт. */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top,
          left: insets.left,
          right: insets.right,
          overflow: "hidden",
        }}
      >
        <Animated.View
          testID="orders-filters-panel"
          onLayout={(event) =>
            setFiltersHeight(event.nativeEvent.layout.height)
          }
          style={[
            {
              paddingTop: theme.spacing.xs,
              paddingBottom: theme.spacing.md,
              backgroundColor: theme.colors.background.grouped,
            },
            headerStyle,
          ]}
        >
          <ScrollView
            ref={filterBar}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.md,
              gap: theme.spacing.xs,
            }}
          >
            {orderFilters.map(({ value, label }) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === value }}
                aria-pressed={filter === value}
                onPress={() => selectFilter(value)}
                style={({ pressed }) => ({
                  minHeight: 44,
                  justifyContent: "center",
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.full,
                  backgroundColor:
                    filter === value
                      ? theme.colors.text.primary
                      : theme.colors.background.elevated,
                  opacity: pressed ? theme.opacity.pressed : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.md,
                    fontFamily: theme.typography.fontFamily.medium,
                    color:
                      filter === value
                        ? theme.colors.background.primary
                        : theme.colors.text.secondary,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
