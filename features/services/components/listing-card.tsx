import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { ListingImage } from "@/features/services/components/listing-image";
import type { CatalogListing } from "@/features/services/types/catalog.types";
import { formatListingPrice } from "@/features/services/utils/listing-presentation";
import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

/** Предложение в ленте: изображение, цена, название и место; избранное не открывает детали. */
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
    <View testID={`listing-card-${listing.id}`} style={{ flex: 1 }}>
      {/* Изображение и текст открывают одну карточку; цена стоит перед названием, как в референсе. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${listing.title}, ${formatListingPrice(listing)}`}
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
            aspectRatio: 1,
            overflow: "hidden",
            borderRadius: theme.radius.md,
            borderCurve: "continuous",
          }}
        >
          <ListingImage source={listing.image} label={listing.title} />
        </View>
        <View style={{ gap: theme.spacing.xxs }}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
              fontSize: theme.typography.fontSize.titleSm,
              lineHeight: theme.typography.lineHeight.titleSm,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatListingPrice(listing)}
          </Text>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.md,
              lineHeight: theme.typography.lineHeight.md,
            }}
          >
            {listing.title}
          </Text>
          <Text
            style={{
              color: theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.sm,
              lineHeight: theme.typography.lineHeight.sm,
            }}
          >
            {listing.location}
          </Text>
        </View>
      </Pressable>

      {/* Сердце поверх изображения занимает постоянные 48 pt во всех состояниях. */}
      <IconButton
        icon={favorite ? "heart" : "heart-outline"}
        label={`${favorite ? "Убрать из избранного" : "В избранное"}: ${listing.title}`}
        selected={favorite}
        onPress={() => toggleFavorite(listing.id)}
        color={favorite ? theme.colors.status.error : theme.colors.text.primary}
        style={{
          position: "absolute",
          top: theme.spacing.xxs,
          right: theme.spacing.xxs,
          backgroundColor: theme.colors.background.primary,
        }}
      />
    </View>
  );
}
