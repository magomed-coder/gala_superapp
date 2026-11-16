import type { CatalogSearchParams } from "@/features/search/types/catalog-search-params";
import type { CatalogFilters } from "@/features/services/types/catalog.types";
import { useState } from "react";
import { Keyboard } from "react-native";

/** Хранит критерии в пределах экрана; начальные параметры восстанавливают их после перехода между разделами. */
export function useCatalogSearch(initial: CatalogSearchParams = {}) {
  const [query, setQuery] = useState(initial.q ?? "");
  const [maxPrice, setMaxPrice] = useState(
    (initial.maxPrice ?? "").replace(/\D/g, "").slice(0, 12),
  );
  const [sort, setSort] = useState<NonNullable<CatalogFilters["sort"]>>(
    initial.sort === "price-asc" || initial.sort === "price-desc"
      ? initial.sort
      : "recommended",
  );
  const [showFilters, setShowFilters] = useState(initial.filters === "1");
  const hasPriceOrSort = Boolean(maxPrice) || sort !== "recommended";

  /** Очищает критерии, сохраняя категорию и подкатегорию, которыми управляет экран маршрута. */
  const reset = () => {
    setQuery("");
    setMaxPrice("");
    setSort("recommended");
    Keyboard.dismiss();
  };

  return {
    query,
    setQuery,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    showFilters,
    setShowFilters,
    hasPriceOrSort,
    reset,
  };
}
