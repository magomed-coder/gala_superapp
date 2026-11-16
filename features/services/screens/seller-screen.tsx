import {
  findCatalogSeller,
  getSellerListings,
} from "@/features/services/api/sellers.api";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { SellerIdentity } from "@/features/services/components/seller-identity";
import { AllinText } from "@/shared/components/allin-text";
import { useAppTheme } from "@/shared/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

/** Страница магазина или исполнителя: его данные и виртуализированная сетка только собственных предложений. */
export default function SellerScreen() {
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();
  const theme = useAppTheme();
  const seller = findCatalogSeller(sellerId);

  if (!seller) {
    return (
      <>
        <Stack.Screen options={{ title: "Продавец" }} />
        <CatalogEmptyState title="Продавец не найден" />
      </>
    );
  }

  const listings = getSellerListings(seller.id);
  const title =
    seller.kind === "store"
      ? "Магазин"
      : seller.kind === "specialist"
        ? "Исполнитель"
        : "Продавец";

  return (
    <View
      testID="seller-details"
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <Stack.Screen options={{ headerShown: true, title }} />
      {/* Профиль — шапка того же списка: предложения не вложены в отдельный ScrollView. */}
      <CatalogFeed
        listings={listings}
        scrollResetKey={seller.id}
        emptyTitle="Предложений пока нет"
        emptyDescription="Продавец ещё не добавил товары или услуги."
        header={
          <View
            style={{
              paddingTop: theme.spacing.md,
              paddingBottom: theme.spacing.xs,
              gap: theme.spacing.lg,
            }}
          >
            {/* Данные магазина сохраняют переносы длинного имени и системный масштаб текста. */}
            <SellerIdentity seller={seller} />
            <View style={{ gap: theme.spacing.xs }}>
              <Text
                accessibilityRole="header"
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                {seller.kind === "store" ? "О магазине" : "О продавце"}
              </Text>
              <AllinText
                selectable
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.md,
                  lineHeight: theme.typography.lineHeight.md,
                }}
              >
                {seller.description}
              </AllinText>
              <Text
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.sm,
                  lineHeight: theme.typography.lineHeight.sm,
                }}
              >
                Демонстрационный профиль. Контакты пока не указаны.
              </Text>
            </View>
            {/* Счётчик берётся из той же выборки, что и сетка; отдельной копии состояния нет. */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                gap: theme.spacing.xs,
                paddingTop: theme.spacing.md,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border.subtle,
              }}
            >
              <Text
                accessibilityRole="header"
                style={{
                  flex: 1,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.title,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
              >
                Предложения
              </Text>
              <Text
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.md,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {listings.length}
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
