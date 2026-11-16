import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { catalogListings } from "@/features/services/api/catalog.data";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { StatusBlock } from "@/shared/components/status-block";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

/** Показывает сохранённые предложения из того же store, который используют кнопки закладок каталога. */
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
      {/* Сохранённые предложения; при пустом списке показываем общий блок состояния. */}
      <CatalogFeed
        listings={listings}
        emptyContent={
          <StatusBlock
            variant="empty"
            title="Пока нет закладок"
            description="Нажмите на значок закладки у предложения — оно появится здесь."
            icon={
              <Ionicons
                name="bookmark-outline"
                size={theme.components.icon.xl}
                color={theme.colors.text.tertiary}
              />
            }
            style={{ marginHorizontal: 0, marginBottom: 0 }}
          />
        }
      />
    </SafeAreaView>
  );
}
