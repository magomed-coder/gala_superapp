import { CatalogSearchResults } from "@/features/search/components/catalog-search-results";
import type { CatalogSearchParams } from "@/features/search/types/catalog-search-params";
import { catalogSearchHref } from "@/features/search/utils/catalog-search-href";
import { findCatalogCategory } from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useLocalSearchParams, useRouter } from "expo-router";

/** Открывает весь раздел; применённый выбор панели заменяет область, сохраняя запрос и критерии. */
export default function CategoryScreen() {
  const params = useLocalSearchParams<
    CatalogSearchParams & { categoryId: string }
  >();
  const category = findCatalogCategory(params.categoryId);
  const router = useRouter();

  if (!category) return <CatalogEmptyState title="Категория не найдена" />;

  return (
    <CatalogSearchResults
      category={category}
      initialSearch={params}
      onChangeScope={(selection, search) =>
        router.replace(catalogSearchHref(selection, search))
      }
    />
  );
}
