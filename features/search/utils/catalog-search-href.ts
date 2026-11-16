import type {
  CatalogSearchParams,
  CatalogSearchSelection,
} from "@/features/search/types/catalog-search-params";
import type { Href } from "expo-router";

/** Выбирает маршрут применённой области; критерии передаются после закрытия панели одним переходом. */
export function catalogSearchHref(
  selection: CatalogSearchSelection,
  search: CatalogSearchParams,
): Href {
  if (!selection.categoryId) {
    return { pathname: "/search", params: search };
  }

  if (selection.subcategoryId) {
    return {
      pathname: "/category/[categoryId]/[subcategoryId]",
      params: {
        categoryId: selection.categoryId,
        subcategoryId: selection.subcategoryId,
        ...search,
      },
    };
  }

  return {
    pathname: "/category/[categoryId]",
    params: { categoryId: selection.categoryId, ...search },
  };
}
