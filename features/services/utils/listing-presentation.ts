import type { CatalogListing } from "@/features/services/types/catalog.types";

/** Показывает фиксированную цену покупки и начальную цену предложения по согласованию. */
export function formatListingPrice(
  listing: Pick<CatalogListing, "purchaseMode" | "price">,
) {
  return `${listing.purchaseMode === "negotiation" ? "от " : ""}${listing.price.toLocaleString("ru-RU")} ₽`;
}
