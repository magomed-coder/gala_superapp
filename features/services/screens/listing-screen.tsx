import { useProfileStore } from "@/features/profile/store/use-profile-store";
import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { findCatalogSeller } from "@/features/services/api/sellers.api";
import { SellerIdentity } from "@/features/services/components/seller-identity";
import { ListingPurchaseActions } from "@/features/services/components/listing-purchase-actions";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { formatListingPrice } from "@/features/services/utils/listing-presentation";
import { AllinText } from "@/shared/components/allin-text";
import { IconButton } from "@/shared/components/icon-button";
import { Swiper } from "@/shared/components/swiper";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Показывает товар или услугу с изображением, условиями и сохранением в прозрачной шапке. */
export default function ListingScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const listing = catalogListings.find((item) => item.id === listingId);
  const favorite = useProfileStore((state) =>
    state.favoriteServices.includes(listingId),
  );
  const toggleFavorite = useProfileStore(
    (state) => state.toggleFavoriteService,
  );
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [shareError, setShareError] = useState("");

  if (!listing) return <CatalogEmptyState title="Предложение не найдено" />;

  const category = findCatalogCategory(listing.categoryId);
  const subcategory = category?.children.find(
    (item) => item.id === listing.subcategoryId,
  );
  const service = listing.kind === "service";
  const price = formatListingPrice(listing);
  const seller = findCatalogSeller(listing.sellerId);

  /** Открывает самостоятельную страницу владельца предложения по его ID. */
  const openSeller = () => {
    if (!seller) return;

    router.push({
      pathname: "/seller/[sellerId]",
      params: { sellerId: seller.id },
    });
  };

  /** Передаёт системному меню реальные данные объявления; ошибка оставляет повтор доступным. */
  const shareListing = async () => {
    setShareError("");
    try {
      await Share.share({
        title: listing.title,
        message: `${listing.title}\n${price}\n${listing.location}\n${listing.seller}`,
      });
    } catch (error) {
      // Отмена системного меню пользователем не является ошибкой отправки.
      if (error instanceof Error && error.name === "AbortError") return;
      setShareError("Не удалось поделиться. Попробуйте ещё раз.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: listing.title,
          statusBarStyle: theme.mode === "dark" ? "light" : "dark",
        }}
      />
      {/* Прозрачная шапка лежит поверх фото и не занимает место в потоке; отступ защищает кнопки от выреза. */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.header,
          backgroundColor: "transparent",
          paddingTop: insets.top,
          paddingLeft: Math.max(insets.left, theme.spacing.xxs),
          paddingRight: Math.max(insets.right, theme.spacing.xxs),
          minHeight: insets.top + theme.components.header.height,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xxs,
        }}
      >
        <IconButton
          icon={process.env.EXPO_OS === "ios" ? "chevron-back" : "arrow-back"}
          label="Назад"
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace("/(tabs)/services")
          }
          style={{ backgroundColor: theme.colors.background.primary }}
        />
        <View pointerEvents="none" style={{ flex: 1 }} />
        {/* Одинаковые круглые кнопки сохраняют размер при смене иконки и состояния закладки. */}
        <IconButton
          icon="share-outline"
          label="Поделиться объявлением"
          onPress={() => void shareListing()}
          style={{ backgroundColor: theme.colors.background.primary }}
        />
        <IconButton
          icon={favorite ? "bookmark" : "bookmark-outline"}
          label={favorite ? "Убрать из избранного" : "Добавить в избранное"}
          selected={favorite}
          color={
            favorite ? theme.colors.status.error : theme.colors.text.primary
          }
          onPress={() => toggleFavorite(listing.id)}
          style={{ backgroundColor: theme.colors.background.primary }}
        />
      </View>

      <ScrollView
        key={listing.id}
        testID="listing-details"
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + theme.spacing.lg,
        }}
      >
        {/* Квадратный свайпер на всю ширину показывает фото целиком и сам открывает полноэкранный просмотр. */}
        <Swiper
          key={listing.id}
          data={[listing.image]}
          accessibilityLabel={listing.title}
          imageResizeMode="contain"
        />

        <View
          style={{
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.lg,
            paddingLeft: Math.max(insets.left, theme.spacing.lg),
            paddingRight: Math.max(insets.right, theme.spacing.lg),
            gap: theme.spacing.lg,
          }}
        >
          {/* Название и категория образуют компактный блок под фото; рейтинг и вымышленные артикулы не добавляются. */}
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              selectable
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.h3,
                lineHeight: theme.typography.lineHeight.h3,
              }}
            >
              {listing.title}
            </Text>
            {/* Цена остаётся рядом с названием и прокручивается вместе с содержимым. */}
            <Text
              selectable
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.h3,
                lineHeight: theme.typography.lineHeight.h3,
                fontFamily: theme.typography.fontFamily.medium,
                fontVariant: ["tabular-nums"],
              }}
            >
              {price}
            </Text>
            <Text
              selectable
              style={{
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.sm,
              }}
            >
              {category?.name} · {subcategory?.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xxs,
              }}
            >
              <Ionicons
                name="location-outline"
                size={theme.components.icon.xs}
                color={theme.colors.text.tertiary}
              />
              <Text
                selectable
                style={{
                  flex: 1,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.md,
                  lineHeight: theme.typography.lineHeight.md,
                }}
              >
                {listing.location}
              </Text>
            </View>
          </View>

          {/* Режим предложения определяет кнопки; действия находятся в прокрутке, без нижней панели. */}
          <ListingPurchaseActions
            key={listing.id}
            mode={listing.purchaseMode}
            unitPrice={listing.price}
            notice="Демонстрационное предложение. Покупка и переписка с продавцом пока недоступны."
          />

          {/* Короткое описание открыто целиком, без отдельной карточки и повторяющегося блока характеристик. */}
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              Описание
            </Text>
            <Text
              selectable
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              {listing.description}
            </Text>
          </View>

          {/* Имя и локация продавца сохранены; строка открывает только его магазин или профиль исполнителя. */}
          <View style={{ gap: theme.spacing.xxs }}>
            <Text
              style={{
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {service ? "Исполнитель" : "Продавец"}
            </Text>
            {seller ? (
              <SellerIdentity seller={seller} onPress={openSeller} />
            ) : (
              <AllinText
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                {listing.seller}
              </AllinText>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Ошибка отправки появляется поверх контента и не сдвигает изображение или кнопки шапки. */}
      {shareError ? (
        <View
          accessibilityLiveRegion="polite"
          style={{
            position: "absolute",
            bottom: insets.bottom + theme.spacing.sm,
            left: insets.left + theme.spacing.md,
            right: insets.right + theme.spacing.md,
            zIndex: theme.zIndex.toast,
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.background.elevated,
          }}
        >
          <Text
            style={{
              color: theme.colors.status.error,
              fontSize: theme.typography.fontSize.md,
            }}
          >
            {shareError}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void shareListing()}
            style={({ pressed }) => ({
              minHeight: theme.spacing.xxxl,
              justifyContent: "center",
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Text
              style={{
                color: theme.colors.text.link,
                fontSize: theme.typography.fontSize.md,
              }}
            >
              Повторить
            </Text>
          </Pressable>
          <IconButton
            icon="close"
            label="Скрыть ошибку отправки"
            onPress={() => setShareError("")}
            style={{ alignSelf: "flex-end" }}
          />
        </View>
      ) : null}
    </View>
  );
}
