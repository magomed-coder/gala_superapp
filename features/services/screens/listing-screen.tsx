import { useProfileStore } from "@/features/profile/store/use-profile-store";
import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { ListingImage } from "@/features/services/components/listing-image";
import { ListingPhotoViewer } from "@/features/services/components/listing-photo-viewer";
import { formatListingPrice } from "@/features/services/utils/listing-presentation";
import { AllinText } from "@/shared/components/allin-text";
import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Карточка товара или услуги: большое изображение, условия, продавец и закреплённое сохранение. */
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
  const [photoOpen, setPhotoOpen] = useState(false);
  const [shareError, setShareError] = useState("");

  if (!listing) return <CatalogEmptyState title="Предложение не найдено" />;

  const category = findCatalogCategory(listing.categoryId);
  const subcategory = category?.children.find(
    (item) => item.id === listing.subcategoryId,
  );
  const service = listing.kind === "service";
  const price = formatListingPrice(listing);
  const titleStyle = {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.title,
    lineHeight: theme.typography.lineHeight.title,
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
      {/* Компактная шапка сохраняет возврат и системное меню отправки при прокрутке. */}
      <View
        style={{
          paddingTop: insets.top,
          paddingLeft: Math.max(insets.left, theme.spacing.xxs),
          paddingRight: Math.max(insets.right, theme.spacing.xxs),
          minHeight: insets.top + theme.components.header.height,
          flexDirection: "row",
          alignItems: "center",
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
        />
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          {service ? "Услуга" : "Товар"}
        </Text>
        <IconButton
          icon="share-outline"
          label="Поделиться объявлением"
          onPress={() => void shareListing()}
        />
      </View>

      <ScrollView
        key={listing.id}
        testID="listing-details"
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: theme.spacing.lg,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {/* Размер изображения фиксируется до загрузки; нажатие открывает его целиком. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Открыть изображение"
          onPress={() => setPhotoOpen(true)}
          style={({ pressed }) => ({
            aspectRatio: 4 / 3,
            opacity: pressed ? theme.opacity.pressed : 1,
          })}
        >
          <ListingImage
            key={listing.id}
            source={listing.image}
            label={listing.title}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: theme.spacing.sm,
              right: theme.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.radius.full,
              backgroundColor: theme.colors.background.primary,
            }}
          >
            <Text
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              1 / 1
            </Text>
            <Ionicons
              name="expand-outline"
              size={theme.components.icon.xs}
              color={theme.colors.text.primary}
            />
          </View>
        </Pressable>

        <View style={{ padding: theme.spacing.md, gap: theme.spacing.lg }}>
          {/* Цена и название — главная информация; длинные значения могут переноситься. */}
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              selectable
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
                fontSize: theme.typography.fontSize.h1,
                lineHeight: theme.typography.lineHeight.h1,
                fontVariant: ["tabular-nums"],
              }}
            >
              {price}
            </Text>
            <Text
              selectable
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.title,
                lineHeight: theme.typography.lineHeight.title,
              }}
            >
              {listing.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons
                name="location-outline"
                size={theme.components.icon.sm}
                color={theme.colors.text.tertiary}
              />
              <Text
                selectable
                style={{
                  flex: 1,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.md,
                }}
              >
                {listing.location}
              </Text>
            </View>
          </View>

          {/* Свойства берутся из каталога: вымышленных рейтингов и характеристик нет. */}
          <View
            style={{
              gap: theme.spacing.sm,
              paddingTop: theme.spacing.lg,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.subtle,
            }}
          >
            <Text accessibilityRole="header" style={titleStyle}>
              {service ? "Об услуге" : "О товаре"}
            </Text>
            <View style={{ gap: theme.spacing.xxs }}>
              <Text
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.md,
                }}
              >
                Категория
              </Text>
              <Text
                selectable
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                  lineHeight: theme.typography.lineHeight.lg,
                }}
              >
                {category?.name} · {subcategory?.name}
              </Text>
            </View>
            <Text
              selectable
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              {service
                ? "Итоговая стоимость зависит от объёма работ."
                : "Наличие и комплектацию уточняйте у продавца."}
            </Text>
          </View>

          {/* Описание остаётся открытым: короткие демоданные не требуют кнопки «Ещё». */}
          <View style={{ gap: theme.spacing.sm }}>
            <Text accessibilityRole="header" style={titleStyle}>
              Описание
            </Text>
            <Text
              selectable
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.lg,
                lineHeight: theme.typography.lineHeight.lg,
              }}
            >
              {listing.description}
            </Text>
          </View>

          {/* Продавец отделён линией; ограничение демокаталога объясняет отсутствие связи. */}
          <View
            style={{
              gap: theme.spacing.sm,
              paddingTop: theme.spacing.lg,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.subtle,
            }}
          >
            <Text accessibilityRole="header" style={titleStyle}>
              {service ? "Исполнитель" : "Продавец"}
            </Text>
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
                  borderRadius: theme.radius.full,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.background.secondary,
                }}
              >
                <Ionicons
                  name={service ? "person-outline" : "storefront-outline"}
                  size={theme.components.icon.md}
                  color={theme.colors.text.secondary}
                />
              </View>
              <View style={{ flex: 1, gap: theme.spacing.xxs }}>
                <AllinText
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.lg,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  {listing.seller}
                </AllinText>
                <Text
                  style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.md,
                  }}
                >
                  {listing.location}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              Демонстрационное объявление. Связь и оформление заказа пока
              недоступны.
            </Text>
          </View>

          {/* Возврат к тому же разделу позволяет продолжить выбор без сброса навигации на главную. */}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/category/[categoryId]/[subcategoryId]",
                params: {
                  categoryId: listing.categoryId,
                  subcategoryId: listing.subcategoryId,
                },
              })
            }
            style={({ pressed }) => ({
              minHeight: theme.spacing.xxxl,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Text
              style={{
                flex: 1,
                color: theme.colors.text.link,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              Другие предложения в разделе
            </Text>
            <Ionicons
              name="chevron-forward"
              size={theme.components.icon.sm}
              color={theme.colors.text.link}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Нижняя панель находится в потоке: высота с Dynamic Type не перекрывает описание. */}
      <View
        style={{
          paddingTop: theme.spacing.sm,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
          paddingLeft: insets.left + theme.spacing.md,
          paddingRight: insets.right + theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.subtle,
          gap: theme.spacing.xs,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? "Убрать из избранного" : "Добавить в избранное"
          }
          accessibilityState={{ selected: favorite }}
          onPress={() => toggleFavorite(listing.id)}
          style={({ pressed }) => ({
            minHeight: theme.components.button.height,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: favorite
              ? theme.colors.background.secondary
              : theme.colors.brand.primary,
            opacity: pressed ? theme.opacity.pressed : 1,
          })}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={theme.components.icon.md}
            color={
              favorite
                ? theme.colors.status.error
                : theme.colors.brand.onPrimary
            }
          />
          <Text
            style={{
              flexShrink: 1,
              textAlign: "center",
              color: favorite
                ? theme.colors.text.primary
                : theme.colors.brand.onPrimary,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            {favorite ? "В избранном" : "В избранное"}
          </Text>
        </Pressable>
        {/* Ошибка отправки зарезервирована поверх контента и не двигает основное действие. */}
        {shareError ? (
          <View
            accessibilityLiveRegion="polite"
            style={{
              position: "absolute",
              bottom: "100%",
              left: theme.spacing.md,
              right: theme.spacing.md,
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
      {photoOpen && (
        <ListingPhotoViewer
          listing={listing}
          onClose={() => setPhotoOpen(false)}
        />
      )}
    </View>
  );
}
