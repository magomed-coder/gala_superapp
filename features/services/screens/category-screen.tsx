import { findCatalogCategory } from "@/features/services/api/catalog.data";
import { CatalogBrowse } from "@/features/services/components/catalog-browse";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useLocalSearchParams, useRouter } from "expo-router";

/** Список раздела: компактные подкатегории и предложения сразу под поиском. */
export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = findCatalogCategory(categoryId);
  const router = useRouter();

  if (!category) return <CatalogEmptyState title="Категория не найдена" />;

  return (
    <CatalogBrowse
      category={category}
      onSelectSubcategory={(subcategoryId) => {
        if (!subcategoryId) return;
        router.push({
          pathname: "/category/[categoryId]/[subcategoryId]",
          params: { categoryId: category.id, subcategoryId },
        });
      }}
    />
  );
}
