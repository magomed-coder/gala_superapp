import sources from "@/assets/imgs/catalog/sources.json";
import { catalogImages } from "@/features/services/utils/catalog-images";
import type {
  CatalogCategory,
  CatalogListing,
} from "@/features/services/types/catalog.types";

// Главная, поиск и выдача используют одну согласованную структуру подкатегорий.
export const catalogCategories: CatalogCategory[] = sources.categories.map(
  (category) => ({
    id: category.categoryId,
    name: category.categoryName,
    image: catalogImages[`${category.categoryId}.png`],
    description: category.categoryName,
    children: category.images.map((item) => ({
      id: item.subcategoryId,
      name: item.name,
      image: catalogImages[item.file],
      audience: item.audience ?? undefined,
    })),
  }),
);

// Фиксированные данные дают одинаковые карточки при перезагрузке и SSR.
export const catalogListings: CatalogListing[] = catalogCategories.flatMap(
  (category, categoryIndex) =>
    category.children.flatMap((child, childIndex) =>
      [0, 1].map((variant) => ({
        id: `${category.id}-${child.id}-${variant + 1}`,
        categoryId: category.id,
        subcategoryId: child.id,
        title:
          variant === 0 ? child.name : `${child.name} — индивидуальный подход`,
        price: 500 + categoryIndex * 250 + childIndex * 350 + variant * 600,
        image: child.image,
        seller: variant === 0 ? "Команда ALLIN" : "Местный специалист",
        location: variant === 0 ? "Грозный, центр" : "Грозный",
        description: `${category.description} Условия, состав работ и итоговая стоимость согласуются с исполнителем. Это демонстрационная карточка для знакомства с каталогом.`,
      })),
    ),
);

/** Возвращает категорию по стабильному идентификатору маршрута. */
export function findCatalogCategory(id: string | undefined) {
  return catalogCategories.find((category) => category.id === id);
}
