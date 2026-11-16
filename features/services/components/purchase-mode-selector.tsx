import type { ListingPurchaseMode } from "@/features/services/types/catalog.types";
import { purchaseModeOptions } from "@/features/services/utils/listing-purchase";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

/** Обязательный выбор способа заказа без предвыбранного значения; оба действия включаются отдельным вариантом. */
export function PurchaseModeSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: ListingPurchaseMode | null;
  onChange: (value: ListingPurchaseMode) => void;
  disabled?: boolean;
}) {
  const theme = useAppTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.lg,
        }}
      >
        Способ заказа · обязательно
      </Text>
      {/* Рамка и место под отметку постоянны: выбор не сдвигает подписи и следующие поля. */}
      {purchaseModeOptions.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          aria-checked={value === option.value}
          aria-disabled={disabled}
          accessibilityLabel={option.label}
          accessibilityHint={option.description}
          accessibilityState={{ checked: value === option.value, disabled }}
          disabled={disabled}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => ({
            minHeight: theme.components.button.height,
            padding: theme.spacing.sm,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderWidth: 1,
            borderRadius: theme.radius.md,
            borderColor:
              value === option.value
                ? theme.colors.brand.primary
                : theme.colors.border.default,
            backgroundColor: theme.colors.background.primary,
            opacity: pressed || disabled ? theme.opacity.pressed : 1,
          })}
        >
          <Ionicons
            name={
              value === option.value ? "radio-button-on" : "radio-button-off"
            }
            size={theme.components.icon.sm}
            color={
              value === option.value
                ? theme.colors.brand.primary
                : theme.colors.text.tertiary
            }
          />
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Text
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              {option.label}
            </Text>
            <Text
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              {option.description}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
