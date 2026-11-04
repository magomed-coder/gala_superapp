import { OrderStatus } from "@/features/orders/components/order-card";
import {
  OrderAction,
  OrderRefreshBar,
  OrdersSkeleton,
  OrderState,
} from "@/features/orders/components/order-states";
import { useDemoOrders } from "@/features/orders/hooks/use-demo-orders";
import {
  formatOrderAmount,
  formatOrderDate,
  isActiveOrder,
  orderTypes,
} from "@/features/orders/utils/order-presentation";
import { useAppTheme } from "@/shared/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshControl, ScrollView, Text, View } from "react-native";

/** Показывает выбранный заказ из общего кеша; неизвестный ID не подменяется чужим заказом. */
export default function OrderDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string | string[] }>();
  const { data, isPending, isError, isFetching, refetch } = useDemoOrders();
  const order = data?.find((item) => item.id === orderId);
  const body = {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.lineHeight.lg,
  };
  const caption = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  };
  const section = {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous" as const,
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}
      contentContainerStyle={{
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
        gap: theme.spacing.lg,
        flexGrow: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching && data !== undefined}
          onRefresh={() => {
            void refetch();
          }}
          tintColor={theme.colors.brand.primary}
          colors={[theme.colors.brand.primary]}
        />
      }
    >
      {/* Строка резервирует место для ошибки; обновление не сдвигает подробности. */}
      <OrderRefreshBar
        description="Информация о заказе"
        busy={isFetching}
        failed={isError && data !== undefined}
        onRefresh={() => {
          void refetch();
        }}
      />
      {isError && data === undefined && (
        <OrderState
          title="Не удалось загрузить заказ"
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
      )}
      {isPending ? (
        <OrdersSkeleton />
      ) : !order && data !== undefined ? (
        <OrderState
          title="Заказ не найден"
          description="Возможно, ссылка устарела. Откройте нужный заказ из списка."
          action={
            <OrderAction
              label="К заказам"
              onPress={() => router.dismissTo("/(tabs)/orders")}
            />
          }
        />
      ) : null}

      {order && (
        <>
          {/* Исполнитель, номер и статус относятся только к заказу из параметра маршрута. */}
          <View style={section}>
            <View style={{ gap: theme.spacing.xxs }}>
              <Text style={caption}>
                {orderTypes[order.type ?? "delivery"].label}
              </Text>
              <Text
                selectable
                style={{
                  ...body,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.h3,
                  lineHeight: theme.typography.lineHeight.h3,
                }}
              >
                {order.providerName || "Ваш заказ"}
              </Text>
              <Text selectable style={caption}>
                № {order.id} · {formatOrderDate(order.createdAt)}
              </Text>
            </View>
            <OrderStatus order={order} />
          </View>

          {/* Состав показан полностью; длинные названия и суммы переносятся без обрезания. */}
          <View style={section}>
            <Text
              accessibilityRole="header"
              style={{
                ...body,
                fontFamily: theme.typography.fontFamily.medium,
              }}
            >
              Состав заказа
            </Text>
            {order.items.length === 0 && (
              <Text style={caption}>Состав заказа уточняется</Text>
            )}
            {order.items.map((item, index) => (
              <View
                key={`${index}-${item.name}`}
                style={{
                  gap: theme.spacing.xxs,
                  paddingBottom: theme.spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.subtle,
                }}
              >
                <Text selectable style={body}>
                  {item.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: theme.spacing.xs,
                  }}
                >
                  <Text selectable style={caption}>
                    {item.quantity} × {formatOrderAmount(item.price)}
                  </Text>
                  <Text
                    selectable
                    style={{
                      ...body,
                      fontFamily: theme.typography.fontFamily.medium,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {formatOrderAmount(item.quantity * item.price)}
                  </Text>
                </View>
              </View>
            ))}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: theme.spacing.xs,
              }}
            >
              <Text
                style={{
                  ...body,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
              >
                Сумма заказа
              </Text>
              <Text
                selectable
                style={{
                  ...body,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.title,
                  lineHeight: theme.typography.lineHeight.title,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formatOrderAmount(order.totalAmount)}
              </Text>
            </View>
          </View>

          {/* Дата плановая, а не фактическая; отменённому заказу не обещаем выполнение. */}
          <View style={section}>
            {order.address && (
              <View style={{ gap: theme.spacing.xxs }}>
                <Text style={caption}>
                  {order.type === "delivery" ? "Адрес доставки" : "Адрес"}
                </Text>
                <Text selectable style={body}>
                  {order.address}
                </Text>
              </View>
            )}
            <View style={{ gap: theme.spacing.xxs }}>
              <Text style={caption}>
                {isActiveOrder(order)
                  ? "Запланировано на"
                  : "Плановая дата заказа"}
              </Text>
              <Text selectable style={body}>
                {formatOrderDate(order.estimatedDeliveryTime, true)}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
