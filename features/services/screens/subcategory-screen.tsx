import { findCatalogCategory } from "@/features/services/api/catalog.data";
import { CatalogBrowse } from "@/features/services/components/catalog-browse";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { useLocalSearchParams, useRouter } from "expo-router";

/** Список подкатегории сохраняет соседние разделы и контекст при переходе в поиск. */
export default function SubcategoryScreen() {
  const { categoryId, subcategoryId } = useLocalSearchParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const category = findCatalogCategory(categoryId);
  const router = useRouter();

  if (!category?.children.some((child) => child.id === subcategoryId)) {
    return <CatalogEmptyState title="Подкатегория не найдена" />;
  }

  return (
    <CatalogBrowse
      category={category}
      subcategoryId={subcategoryId}
      onSelectSubcategory={(id) => {
        if (id) {
          router.setParams({ subcategoryId: id });
        } else {
          router.replace({
            pathname: "/category/[categoryId]",
            params: { categoryId: category.id },
          });
        }
      }}
    />
  );
}
