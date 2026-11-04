import type {
  CatalogCategory,
  CatalogSubcategory,
} from "@/features/services/types/catalog.types";

/** Берёт до пяти плиток по очереди из каждой группы, чтобы показать состав раздела. */
export function getCategoryPreview(category: CatalogCategory) {
  const preview: CatalogSubcategory[] = [];

  for (let index = 0; preview.length < 5; index += 1) {
    const next = category.groups.flatMap((group) =>
      group.children[index] ? [group.children[index]] : [],
    );
    if (next.length === 0) break;
    preview.push(...next.slice(0, 5 - preview.length));
  }

  return preview;
}
