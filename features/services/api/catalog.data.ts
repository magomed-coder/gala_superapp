import sources from "@/assets/imgs/catalog/sources.json";
import { catalogImages } from "@/features/services/utils/catalog-images";
import type {
  CatalogCategory,
  CatalogCategoryGroup,
  CatalogListing,
} from "@/features/services/types/catalog.types";

// Исходные группы сохраняют изображения, ID предложений и порядок расчёта демоцен.
const sourceCategories = sources.categories.map((category) => ({
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
}));

// Первый ID группы остаётся ID раздела; остальные поддерживаются как старые ссылки.
const sections = [
  { name: "Еда и продукты", groups: ["food-groceries"] },
  {
    name: "Дом и ремонт",
    groups: ["home-repair", "furniture-interior", "cleaning-household"],
  },
  { name: "Техника", groups: ["electronics"] },
  { name: "Авто", groups: ["auto"] },
  { name: "Красота и здоровье", groups: ["beauty-care", "health"] },
  { name: "Семья и обучение", groups: ["children-family", "education"] },
  { name: "Спорт и отдых", groups: ["sports", "travel-leisure"] },
  { name: "Одежда и ателье", groups: ["clothing-tailoring"] },
  {
    name: "Праздники и подарки",
    groups: ["weddings-events", "flowers-gifts"],
  },
  { name: "Недвижимость", groups: ["real-estate"] },
  { name: "Бизнес", groups: ["business-services"] },
  { name: "Сад и животные", groups: ["garden-farming"] },
  { name: "Ислам и община", groups: ["religion-community"] },
];

const groupNames: Record<string, string> = {
  "home-repair": "Ремонт",
  "furniture-interior": "Мебель",
  "cleaning-household": "Уборка",
  education: "Обучение",
  "weddings-events": "Праздники",
};

// Главная, поиск, галерея и выдача используют одинаковые 13 разделов.
export const catalogCategories: CatalogCategory[] = sections.map((section) => {
  const groups: CatalogCategoryGroup[] = section.groups.map((id) => {
    const source = sourceCategories.find((category) => category.id === id);
    if (!source) throw new Error(`Нет исходной группы каталога: ${id}`);

    return {
      id,
      name: groupNames[id] ?? source.name,
      children: source.children,
    };
  });

  return {
    id: section.groups[0],
    name: section.name,
    image: catalogImages[`${section.groups[0]}.png`],
    description:
      groups.length > 1
        ? groups.map((group) => group.name).join(" · ")
        : section.name,
    groups,
    children: groups.flatMap((group) => group.children),
  };
});

// Вид демо-предложения задаётся подкатегорией, а не названием объединённого раздела.
const productSubcategories = new Set([
  "prepared-food",
  "bakeries-cakes",
  "grocery-stores",
  "custom-kitchens",
  "wardrobes",
  "upholstered-furniture",
  "tables-chairs",
  "curtains-blinds",
  "lighting",
  "decor-textiles",
  "phones-accessories",
  "computers-parts",
  "home-appliances",
  "parts-accessories",
  "car-sales",
  "car-installments",
  "pharmacies",
  "children-products",
  "sports-goods",
  "sports-nutrition",
  "womens-clothing",
  "mens-clothing",
  "childrens-clothing",
  "hijabs-scarves",
  "shoes",
  "bags-accessories",
  "bouquets",
  "flower-arrangements",
  "houseplants",
  "gift-sets",
  "personalized-gifts",
  "property-sales",
  "new-buildings",
  "land",
  "seedlings-seeds",
  "garden-tools",
  "animal-supplies",
  "islamic-books",
  "prayer-supplies",
]);

// Фиксированные данные дают одинаковые карточки при перезагрузке и SSR.
export const catalogListings: CatalogListing[] = sourceCategories.flatMap(
  (category, categoryIndex) =>
    category.children.flatMap((child, childIndex) =>
      [0, 1].map((variant) => ({
        id: `${category.id}-${child.id}-${variant + 1}`,
        kind: productSubcategories.has(child.id) ? "product" : "service",
        categoryId: findCatalogCategory(category.id)!.id,
        subcategoryId: child.id,
        title:
          variant === 0
            ? child.name
            : `${child.name} — ${productSubcategories.has(child.id) ? "под заказ" : "индивидуальный подход"}`,
        price: 500 + categoryIndex * 250 + childIndex * 350 + variant * 600,
        image: child.image,
        seller:
          variant === 0
            ? "Команда ALLIN"
            : productSubcategories.has(child.id)
              ? "Местный продавец"
              : "Местный специалист",
        location: variant === 0 ? "Грозный, центр" : "Грозный",
        description: productSubcategories.has(child.id)
          ? `${child.name}. Наличие, комплектацию и условия покупки можно уточнить у продавца. Это демонстрационная карточка для знакомства с каталогом.`
          : `${child.name}. Состав работ, удобное время и итоговая стоимость согласуются с исполнителем. Это демонстрационная карточка для знакомства с каталогом.`,
      })),
    ),
);

/** Находит текущий раздел по его ID или прежнему ID одной из объединённых групп. */
export function findCatalogCategory(id: string | undefined) {
  return catalogCategories.find(
    (category) =>
      category.id === id || category.groups.some((group) => group.id === id),
  );
}
