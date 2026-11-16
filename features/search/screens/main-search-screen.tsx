import { CatalogSearchResults } from "@/features/search/components/catalog-search-results";
import type { CatalogSearchParams } from "@/features/search/types/catalog-search-params";
import { findCatalogCategory } from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

/** Вход в общий поиск: позволяет менять родительские категории и сохраняет область старых прямых ссылок. */
export default function MainSearchScreen() {
  const params = useLocalSearchParams<
    CatalogSearchParams & { categoryId?: string; subcategoryId?: string }
  >();
  const [categoryId, setCategoryId] = useState(
    findCatalogCategory(params.categoryId)?.id ?? params.categoryId ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    params.subcategoryId ?? "",
  );
  const category = findCatalogCategory(categoryId);

  if (
    (categoryId && !category) ||
    (subcategoryId &&
      !category?.children.some((child) => child.id === subcategoryId))
  ) {
    return <CatalogEmptyState title="Раздел поиска не найден" />;
  }

  return (
    <CatalogSearchResults
      category={category}
      subcategoryId={subcategoryId}
      initialSearch={params}
      onChangeScope={(selection) => {
        setCategoryId(selection.categoryId);
        setSubcategoryId(selection.subcategoryId);
      }}
    />
  );
}
