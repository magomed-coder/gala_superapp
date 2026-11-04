import {
  formatOrderAmount,
  formatOrderDate,
  getOrderStatus,
  orderTypes,
} from "@/features/orders/utils/order-presentation";
import type { Order } from "@/shared/mocks/mock-data";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

/** Статус с постоянной областью иконки; текст остаётся читаемым в обеих темах. */
export function OrderStatus({ order }: { order: Order }) {
  const theme = useAppTheme();
  const status = getOrderStatus(order);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
      }}
    >
      <Ionicons
        name={status.icon}
        size={theme.components.icon.sm}
        color={theme.colors.status[status.tone]}
      />
      <Text
        style={{
          flexShrink: 1,
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        }}
      >
        {status.label}
      </Text>
    </View>
  );
}

/** Краткое содержание заказа; вся карточка открывает его подробности через onPress. */
export function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const type = orderTypes[order.type ?? "delivery"];
  const title = order.providerName || type.label;
  const caption = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  };

  return (
    <Pressable
      testID={`order-card-${order.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${getOrderStatus(order).label}. ${formatOrderAmount(order.totalAmount)}. Заказ ${order.id}`}
      accessibilityHint="Открыть состав и подробности заказа"
      onPress={onPress}
      style={({ pressed }) => ({
        padding: theme.spacing.md,
        gap: theme.spacing.md,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        backgroundColor: theme.colors.background.elevated,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      {/* Иконка типа и стрелка занимают постоянные места; длинное имя переносится. */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <View
          style={{
            width: theme.components.avatar.lg,
            height: theme.components.avatar.lg,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.background.secondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={type.icon}
            size={theme.components.icon.md}
            color={theme.colors.text.primary}
          />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.fontSize.lg,
              lineHeight: theme.typography.lineHeight.lg,
            }}
          >
            {title}
          </Text>
          <Text style={caption}>{type.label}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={theme.components.icon.sm}
          color={theme.colors.text.tertiary}
        />
      </View>

      {/* Состав помогает узнать заказ; полный перечень доступен на отдельном экране. */}
      <Text numberOfLines={2} style={caption}>
        {order.items.map((item) => item.name).join(" · ") ||
          "Состав заказа уточняется"}
      </Text>
      <OrderStatus order={order} />

      {/* Дата и сумма могут перейти на две строки при крупном системном шрифте. */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.subtle,
          paddingTop: theme.spacing.sm,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        <Text style={{ ...caption, fontSize: theme.typography.fontSize.sm }}>
          {formatOrderDate(order.createdAt)}
        </Text>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.bold,
            fontSize: theme.typography.fontSize.titleSm,
            lineHeight: theme.typography.lineHeight.titleSm,
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatOrderAmount(order.totalAmount)}
        </Text>
      </View>
    </Pressable>
  );
}
