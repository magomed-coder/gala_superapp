import type { CatalogListing } from "@/features/services/types/catalog.types";

/** Показывает фиксированную демоцену товара и начальную стоимость услуги одинаково во всех представлениях. */
export function formatListingPrice(
  listing: Pick<CatalogListing, "kind" | "price">,
) {
  return `${listing.kind === "service" ? "от " : ""}${listing.price.toLocaleString("ru-RU")} ₽`;
}
