import { catalogListings } from "@/features/services/api/catalog.data";
import { CatalogCategoryStrip } from "@/features/services/components/catalog-category-strip";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { CatalogResultsHeader } from "@/features/services/components/catalog-results-header";
import { CatalogToolbar } from "@/features/services/components/catalog-toolbar";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { useAppTheme } from "@/shared/theme";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

/** Общая выдача двух маршрутов: область задаётся явно, выбор категории обрабатывает экран. */
export function CatalogBrowse({
  category,
  subcategoryId = "",
  onSelectSubcategory,
}: {
  category: CatalogCategory;
  subcategoryId?: string;
  onSelectSubcategory: (id: string) => void;
}) {
  const theme = useAppTheme();
  const router = useRouter();
  const title =
    category.children.find((child) => child.id === subcategoryId)?.name ??
    category.name;
  const listings = filterCatalog(catalogListings, {
    categoryId: category.id,
    subcategoryId,
  });

  /** Поиск получает текущий раздел; флаг открывает только панель критериев выдачи. */
  const openSearch = (filters = false) => {
    router.push({
      pathname: "/search",
      params: {
        categoryId: category.id,
        subcategoryId,
        ...(filters ? { filters: "1" } : {}),
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <Stack.Screen
        options={{
          title,
          headerShown: false,
          statusBarStyle: theme.mode === "dark" ? "light" : "dark",
        }}
      />
      {/* Закреплённая шапка оставляет поиск доступным при прокрутке предложений. */}
      <CatalogToolbar
        onSearch={() => openSearch()}
        onFilters={() => openSearch(true)}
      />
      <CatalogFeed
        key={subcategoryId}
        listings={listings}
        header={
          <View style={{ gap: theme.spacing.md }}>
            {/* Категории прокручиваются вместе с лентой, не перекрывая товары. */}
            <View style={{ marginHorizontal: -theme.spacing.md }}>
              <CatalogCategoryStrip
                items={[{ id: "", name: "Весь раздел" }, ...category.children]}
                selectedId={subcategoryId}
                onSelect={onSelectSubcategory}
              />
            </View>
            <CatalogResultsHeader title={title} count={listings.length} />
          </View>
        }
      />
    </View>
  );
}
