import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { catalogListings } from "@/features/services/api/catalog.data";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { useAppTheme } from "@/shared/theme";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Показывает сохранённые предложения из того же store, который используют сердечки каталога. */
export default function FavoritesScreen() {
  const favorites = useProfileStore((state) => state.favoriteServices);
  const theme = useAppTheme();
  const listings = catalogListings.filter((listing) =>
    favorites.includes(listing.id),
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <CatalogFeed
        listings={listings}
        emptyTitle="Сохраните то, что понравилось"
        emptyDescription="Нажмите на сердечко у предложения — оно появится здесь."
        header={
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.md,
            }}
          >
            Сохранено: {listings.length}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
