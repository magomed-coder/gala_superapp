import type { CatalogSeller } from "@/features/services/types/catalog.types";
import { AllinText } from "@/shared/components/allin-text";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

/** Показывает имя и локацию продавца; onPress превращает строку в доступный переход к его профилю. */
export function SellerIdentity({
  seller,
  onPress,
}: {
  seller: CatalogSeller;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
      }}
    >
      {/* Постоянный размер аватара защищает текст от сдвигов; логотип магазина в демоданных не задан. */}
      <View
        style={{
          width: theme.components.avatar.lg,
          height: theme.components.avatar.lg,
          borderRadius: theme.radius.full,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <Ionicons
          name={
            seller.kind === "specialist"
              ? "person-outline"
              : "storefront-outline"
          }
          size={theme.components.icon.md}
          color={theme.colors.text.primary}
        />
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <AllinText
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.titleSm,
            lineHeight: theme.typography.lineHeight.titleSm,
            fontFamily: theme.typography.fontFamily.medium,
          }}
        >
          {seller.name}
        </AllinText>
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          }}
        >
          {seller.location}
        </Text>
      </View>
      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={theme.components.icon.sm}
          color={theme.colors.text.tertiary}
        />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Открыть профиль продавца: ${seller.name}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.spacing.xxxl,
        paddingVertical: theme.spacing.xs,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      {/* Имя, локация и стрелка образуют одну область перехода без вложенных кнопок. */}
      {content}
    </Pressable>
  );
}
