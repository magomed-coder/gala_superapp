import { CatalogSearchResults } from "@/features/search/components/catalog-search-results";
import type { CatalogSearchParams } from "@/features/search/types/catalog-search-params";
import { catalogSearchHref } from "@/features/search/utils/catalog-search-href";
import { findCatalogCategory } from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useLocalSearchParams, useRouter } from "expo-router";

/** Выдача подкатегории сохраняет поиск и меняет область только после применения нижней панели. */
export default function SubcategoryScreen() {
  const params = useLocalSearchParams<
    CatalogSearchParams & { categoryId: string; subcategoryId: string }
  >();
  const category = findCatalogCategory(params.categoryId);
  const router = useRouter();

  if (!category?.children.some((child) => child.id === params.subcategoryId)) {
    return <CatalogEmptyState title="Подкатегория не найдена" />;
  }

  return (
    <CatalogSearchResults
      category={category}
      subcategoryId={params.subcategoryId}
      initialSearch={params}
      onChangeScope={(selection, search) =>
        router.replace(catalogSearchHref(selection, search))
      }
    />
  );
}
