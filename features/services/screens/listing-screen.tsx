import { AllinText } from "@/shared/components/allin-text";
import { useProfileStore } from "@/features/profile/store/use-profile-store";
import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useAppTheme } from "@/shared/theme";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Подробности выбранного предложения; неизвестный ID не подменяется другой карточкой. */
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

  if (!listing) return <CatalogEmptyState title="Предложение не найдено" />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background.primary }}
      contentContainerStyle={{
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.lg + insets.bottom,
        gap: theme.spacing.lg,
      }}
    >
      <View
        style={{
          aspectRatio: 1.25,
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.background.secondary,
          overflow: "hidden",
        }}
      >
        <Image
          source={listing.image}
          contentFit="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      {/* Название относится к объявлению; заголовок навигации остаётся общим. */}
      <View style={{ gap: theme.spacing.sm }}>
        <Text
          selectable
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.h2,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          {listing.title}
        </Text>
        <Text
          selectable
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.h3,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          от {listing.price.toLocaleString("ru-RU")} ₽
        </Text>
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          {listing.location}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: favorite }}
        onPress={() => toggleFavorite(listing.id)}
        style={({ pressed }) => ({
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.md,
          borderRadius: theme.radius.lg,
          backgroundColor: favorite
            ? theme.colors.background.secondary
            : theme.colors.brand.primary,
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Text
          style={{
            color: favorite
              ? theme.colors.text.primary
              : theme.colors.brand.onPrimary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          {favorite ? "Убрать из избранного" : "Добавить в избранное"}
        </Text>
      </Pressable>
      <View style={{ gap: theme.spacing.xs }}>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.bold,
            fontSize: theme.typography.fontSize.title,
          }}
        >
          Описание
        </Text>
        <Text
          selectable
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
          }}
        >
          {listing.description}
        </Text>
        <AllinText
          style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.md,
          }}
        >
          {`${listing.seller} · Демо-предложение`}
        </AllinText>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: "/category/[categoryId]",
            params: { categoryId: listing.categoryId },
          })
        }
        style={({ pressed }) => ({
          minHeight: 48,
          justifyContent: "center",
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Text
          style={{
            color: theme.colors.text.link,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          Ещё в категории «{findCatalogCategory(listing.categoryId)?.name}» →
        </Text>
      </Pressable>
    </ScrollView>
  );
}

