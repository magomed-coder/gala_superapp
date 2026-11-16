import type { ListingPurchaseMode } from "@/features/services/types/catalog.types";
import {
  getPurchaseCapabilities,
  calculatePurchaseTotal,
  clampPurchaseQuantity,
  MAX_PURCHASE_QUANTITY,
  purchaseModeOptions,
} from "@/features/services/utils/listing-purchase";
import { Button } from "@/shared/components/themed-button";
import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { useState } from "react";
import { Text, View, type TextStyle } from "react-native";

/** Показывает действия выбранного режима в карточке и предпросмотре; без обработчика действие недоступно. */
export function ListingPurchaseActions({
  mode,
  unitPrice,
  onBuy,
  onDiscuss,
  notice,
}: {
  mode: ListingPurchaseMode;
  unitPrice: number | null;
  onBuy?: (quantity: number) => void;
  onDiscuss?: () => void;
  notice: string;
}) {
  const theme = useAppTheme();
  const { canBuy, canDiscuss } = getPurchaseCapabilities(mode);

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {/* Основное действие — покупка; обсуждение в совместном режиме остаётся второстепенным. */}
      <Text
        style={{
          color: theme.colors.text.secondary,
          fontSize: theme.typography.fontSize.md,
        }}
      >
        {purchaseModeOptions.find((option) => option.value === mode)?.label}
      </Text>
      {canBuy && <PurchaseControls unitPrice={unitPrice} onBuy={onBuy} />}
      {canDiscuss && (
        <Button
          label="Обсудить с продавцом"
          variant={canBuy ? "outline" : "solid"}
          onPress={() => onDiscuss?.()}
          disabled={!onDiscuss}
        />
      )}
      {/* Ограничение доступности объясняется рядом с кнопками, без ложного успешного заказа. */}
      <Text
        style={{
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          lineHeight: theme.typography.lineHeight.sm,
        }}
      >
        {notice}
      </Text>
    </View>
  );
}

/** Управляет количеством единиц и итогом; передаёт выбранное количество обработчику покупки. */
function PurchaseControls({
  unitPrice,
  onBuy,
}: {
  unitPrice: number | null;
  onBuy?: (quantity: number) => void;
}) {
  const theme = useAppTheme();
  const [quantity, setQuantity] = useState(1);
  const total = calculatePurchaseTotal(unitPrice, quantity);
  const maxTotal = calculatePurchaseTotal(unitPrice, MAX_PURCHASE_QUANTITY);
  const totalText =
    total === null
      ? "Укажите корректную цену"
      : `${total.toLocaleString("ru-RU")} ₽`;
  const reservedTotal =
    maxTotal === null ? totalText : `${maxTotal.toLocaleString("ru-RU")} ₽`;
  const amountStyle: TextStyle = {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.title,
    fontVariant: ["tabular-nums"],
  };

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {/* Кнопки имеют постоянный размер; место для трёх цифр учитывает системный масштаб шрифта. */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.xs,
        }}
      >
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          Количество
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.radius.full,
          }}
        >
          <IconButton
            icon="remove"
            label="Уменьшить количество"
            disabled={quantity === 1}
            onPress={() =>
              setQuantity((value) => clampPurchaseQuantity(value - 1))
            }
          />
          <View
            style={{
              minWidth: theme.spacing.xxxl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              accessible={false}
              aria-hidden
              importantForAccessibility="no-hide-descendants"
              style={{ ...amountStyle, opacity: 0 }}
            >
              {MAX_PURCHASE_QUANTITY}
            </Text>
            <Text
              testID="purchase-quantity"
              accessibilityLiveRegion="polite"
              accessibilityLabel={`Количество: ${quantity}`}
              style={{ ...amountStyle, position: "absolute" }}
            >
              {quantity}
            </Text>
          </View>
          <IconButton
            icon="add"
            label="Увеличить количество"
            disabled={quantity === MAX_PURCHASE_QUANTITY}
            onPress={() =>
              setQuantity((value) => clampPurchaseQuantity(value + 1))
            }
          />
        </View>
      </View>

      {/* Максимальная сумма резервирует место, поэтому смена разрядности не сдвигает кнопку покупки. */}
      <View style={{ gap: theme.spacing.xxs }}>
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
          }}
        >
          Итого
        </Text>
        <View>
          <Text
            accessible={false}
            aria-hidden
            importantForAccessibility="no-hide-descendants"
            style={{ ...amountStyle, opacity: 0 }}
          >
            {reservedTotal}
          </Text>
          <Text
            testID="purchase-total"
            accessibilityLiveRegion="polite"
            style={{ ...amountStyle, position: "absolute", left: 0, right: 0 }}
          >
            {totalText}
          </Text>
        </View>
      </View>
      <Button
        label="Купить"
        onPress={() => onBuy?.(quantity)}
        disabled={!onBuy || total === null}
      />
    </View>
  );
}
