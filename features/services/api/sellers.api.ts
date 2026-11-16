import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import type { CatalogSeller } from "@/features/services/types/catalog.types";

/** Собирает демонстрационные профили по явному ID; совпадающие имена разных продавцов не объединяются. */
function createCatalogSellers(): CatalogSeller[] {
  const sellers = new Map<string, CatalogSeller>();

  for (const listing of catalogListings) {
    if (sellers.has(listing.sellerId)) continue;

    const team = listing.sellerId === "allin-team";
    const category = findCatalogCategory(listing.categoryId);

    sellers.set(listing.sellerId, {
      id: listing.sellerId,
      name: listing.seller,
      kind: team ? "team" : listing.kind === "product" ? "store" : "specialist",
      location: listing.location,
      description: team
        ? "Товары и услуги команды Allin. Здесь собраны предложения из разных разделов каталога."
        : `${listing.kind === "product" ? "Товары" : "Услуги"} из раздела «${category?.name ?? "Каталог"}». Условия и подробности указаны в карточках предложений.`,
    });
  }

  return [...sellers.values()];
}

export const catalogSellers = createCatalogSellers();

/** Возвращает профиль по ID маршрута; неизвестная ссылка не подменяется чужим магазином. */
export function findCatalogSeller(sellerId: string | undefined) {
  return catalogSellers.find((seller) => seller.id === sellerId);
}

/** Выбирает предложения только указанного продавца в исходном порядке каталога. */
export function getSellerListings(sellerId: string) {
  return catalogListings.filter((listing) => listing.sellerId === sellerId);
}
