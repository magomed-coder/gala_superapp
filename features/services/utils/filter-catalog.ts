import type {
  CatalogFilters,
  CatalogListing,
} from "@/features/services/types/catalog.types";

/** Фильтрует предложения по всем выбранным условиям, не изменяя исходный список. */
export function filterCatalog(
  listings: CatalogListing[],
  filters: CatalogFilters,
) {
  const words = (filters.query ?? "")
    .trim()
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .split(/\s+/)
    .filter(Boolean);
  const result = listings.filter((listing) => {
    const text = `${listing.title} ${listing.seller} ${listing.location}`
      .toLocaleLowerCase("ru")
      .replaceAll("ё", "е");
    return (
      (!filters.categoryId || listing.categoryId === filters.categoryId) &&
      (!filters.subcategoryId ||
        listing.subcategoryId === filters.subcategoryId) &&
      (filters.maxPrice === undefined || listing.price <= filters.maxPrice) &&
      words.every((word) => text.includes(word))
    );
  });

  if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  return result;
}
