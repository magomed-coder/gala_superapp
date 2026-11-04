import { useProfileStore } from "@/features/profile/store/use-profile-store";
import type { CatalogListing } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

/** Карточка предложения с отдельным действием сохранения без открытия подробностей. */
export function ListingCard({ listing }: { listing: CatalogListing }) {
  const theme = useAppTheme();
  const router = useRouter();
  const favorite = useProfileStore((state) =>
    state.favoriteServices.includes(listing.id),
  );
  const toggleFavorite = useProfileStore(
    (state) => state.toggleFavoriteService,
  );

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${listing.title}, от ${listing.price} рублей`}
        onPress={() =>
          router.push({
            pathname: "/listing/[listingId]",
            params: { listingId: listing.id },
          })
        }
        style={({ pressed }) => ({
          gap: theme.spacing.xs,
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <View
          style={{
            aspectRatio: 1.05,
            overflow: "hidden",
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.background.secondary,
          }}
        >
          <Image
            source={listing.image}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text
          numberOfLines={3}
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.md,
          }}
        >
          {listing.title}
        </Text>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.bold,
            fontSize: theme.typography.fontSize.titleSm,
          }}
        >
          от {listing.price.toLocaleString("ru-RU")} ₽
        </Text>
        <Text
          style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.md,
          }}
        >
          {listing.location}
        </Text>
      </Pressable>
      {/* Область сердца имеет постоянный размер и не сдвигает карточку. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${favorite ? "Убрать из избранного" : "В избранное"}: ${listing.title}`}
        accessibilityState={{ selected: favorite }}
        onPress={() => toggleFavorite(listing.id)}
        style={({ pressed }) => ({
          position: "absolute",
          top: theme.spacing.xxs,
          right: theme.spacing.xxs,
          width: 44,
          height: 44,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.background.primary,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={theme.components.icon.md}
          color={
            favorite ? theme.colors.status.error : theme.colors.text.primary
          }
        />
      </Pressable>
    </View>
  );
}
