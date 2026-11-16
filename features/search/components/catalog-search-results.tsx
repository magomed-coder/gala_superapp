import { CatalogFilterSheet } from "@/features/search/components/catalog-filter-sheet";
import { useCatalogSearch } from "@/features/search/hooks/use-catalog-search";
import type {
  CatalogSearchParams,
  CatalogSearchSelection,
} from "@/features/search/types/catalog-search-params";
import { catalogListings } from "@/features/services/api/catalog.data";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { CatalogResultsHeader } from "@/features/services/components/catalog-results-header";
import { CatalogToolbar } from "@/features/services/components/catalog-toolbar";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { useAppTheme } from "@/shared/theme";
import { Stack } from "expo-router";
import { Keyboard, View } from "react-native";

type CatalogSearchResultsProps = {
  category?: CatalogCategory;
  subcategoryId?: string;
  initialSearch?: CatalogSearchParams;
  onChangeScope: (
    selection: CatalogSearchSelection,
    search: CatalogSearchParams,
  ) => void;
};

/** Общая выдача ищет на месте; область и дополнительные критерии редактируются черновиком в нижней панели. */
export function CatalogSearchResults({
  category,
  subcategoryId = "",
  initialSearch,
  onChangeScope,
}: CatalogSearchResultsProps) {
  const theme = useAppTheme();
  const search = useCatalogSearch(initialSearch);
  const subcategory = category?.children.find(
    (child) => child.id === subcategoryId,
  );
  const title = subcategory?.name ?? category?.name ?? "Все предложения";
  const listings = filterCatalog(catalogListings, {
    query: search.query,
    categoryId: category?.id,
    subcategoryId,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: search.sort,
  });

  /** Применяет завершённый черновик; маршрут меняется только при выборе другой области после закрытия панели. */
  const applySelection = (selection: CatalogSearchSelection) => {
    search.setMaxPrice(selection.maxPrice);
    search.setSort(selection.sort);
    if (
      selection.categoryId !== (category?.id ?? "") ||
      selection.subcategoryId !== subcategoryId
    ) {
      onChangeScope(selection, {
        q: search.query,
        maxPrice: selection.maxPrice,
        sort: selection.sort,
        filters: "0",
      });
    }
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

      {/* Пока панель открыта, диктор работает только с её элементами. */}
      <View
        style={{ flex: 1 }}
        accessibilityElementsHidden={search.showFilters}
        importantForAccessibility={
          search.showFilters ? "no-hide-descendants" : "auto"
        }
        aria-hidden={search.showFilters}
      >
        {/* Поле остаётся над лентой; отметка фильтров учитывает также выбранную категорию. */}
        <CatalogToolbar
          placeholder="Что ищете?"
          query={search.query}
          onChangeQuery={search.setQuery}
          onFilters={() => {
            Keyboard.dismiss();
            search.setShowFilters(true);
          }}
          filtersActive={
            Boolean(category || subcategoryId) || search.hasPriceOrSort
          }
          filtersExpanded={search.showFilters}
        />

        {/* Над предложениями остаётся только название области и счётчик; открытие панели не сбрасывает прокрутку. */}
        <CatalogFeed
          scrollResetKey={JSON.stringify([
            category?.id,
            subcategoryId,
            search.query,
            search.maxPrice,
            search.sort,
          ])}
          listings={listings}
          onReset={search.reset}
          header={
            <CatalogResultsHeader title={title} count={listings.length} />
          }
        />
      </View>

      {/* При каждом открытии создаётся новый черновик; крестик, фон и свайп закрывают его без применения. */}
      {search.showFilters && (
        <CatalogFilterSheet
          selection={{
            categoryId: category?.id ?? "",
            subcategoryId,
            maxPrice: search.maxPrice,
            sort: search.sort,
          }}
          query={search.query}
          onDismiss={() => search.setShowFilters(false)}
          onApply={applySelection}
        />
      )}
    </View>
  );
}
