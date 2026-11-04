import type {
  CatalogCategory,
  CatalogListing,
} from "@/features/services/types/catalog.types";

const images = {
  repair: require("@/assets/imgs/handyAndRepair.png"),
  home: require("@/assets/imgs/home.png"),
  beauty: require("@/assets/imgs/cut.png"),
  health: require("@/assets/imgs/doc.png"),
  cleaning: require("@/assets/imgs/cleaning.png"),
  laundry: require("@/assets/imgs/dryclean.png"),
  flowers: require("@/assets/imgs/gift.png"),
  electronics: require("@/assets/imgs/phone.png"),
  clothing: require("@/assets/imgs/clothes.png"),
  food: require("@/assets/imgs/restaurant.png"),
  groceries: require("@/assets/imgs/bag.png"),
  hotel: require("@/assets/imgs/hotel.png"),
  travel: require("@/assets/imgs/tour.png"),
  autoRepair: require("@/assets/imgs/autorepair.png"),
  detailing: require("@/assets/imgs/detailing.png"),
  parts: require("@/assets/imgs/autoparts.png"),
};

// Локальный каталог для проверки навигации; транспорт не входит в категории.
export const catalogCategories: CatalogCategory[] = [
  {
    id: "home-repair",
    name: "Дом и ремонт",
    image: images.repair,
    description: "Найдите мастера для больших планов и небольших домашних дел.",
    children: [
      { id: "plumbing", name: "Сантехника", image: images.repair },
      { id: "electrical", name: "Электрика", image: images.home },
      { id: "renovation", name: "Ремонт квартир", image: images.repair },
      { id: "furniture", name: "Сборка мебели", image: images.home },
      { id: "appliances", name: "Ремонт техники", image: images.electronics },
    ],
  },
  {
    id: "beauty-health",
    name: "Красота и здоровье",
    image: images.beauty,
    description: "Мастера, студии и специалисты рядом с вами.",
    children: [
      { id: "hair", name: "Стрижки и укладки", image: images.beauty },
      { id: "nails", name: "Маникюр", image: images.beauty },
      { id: "care", name: "Уход за лицом", image: images.health },
      { id: "massage", name: "Массаж", image: images.health },
      { id: "clinics", name: "Клиники", image: images.health },
    ],
  },
  {
    id: "cleaning",
    name: "Уборка и уход",
    image: images.cleaning,
    description: "Помощь с уборкой дома, вещей и рабочего пространства.",
    children: [
      { id: "apartments", name: "Уборка квартир", image: images.cleaning },
      { id: "windows", name: "Мытьё окон", image: images.cleaning },
      { id: "sofas", name: "Химчистка мебели", image: images.home },
      { id: "clothes", name: "Химчистка одежды", image: images.laundry },
      { id: "offices", name: "Уборка офисов", image: images.cleaning },
    ],
  },
  {
    id: "shopping",
    name: "Покупки и подарки",
    image: images.flowers,
    description: "Местные магазины, нужные вещи и подарки к особому случаю.",
    children: [
      { id: "flowers", name: "Цветы и подарки", image: images.flowers },
      { id: "electronics", name: "Электроника", image: images.electronics },
      { id: "clothing", name: "Одежда и обувь", image: images.clothing },
      { id: "home", name: "Всё для дома", image: images.home },
      { id: "groceries", name: "Продукты", image: images.groceries },
    ],
  },
  {
    id: "leisure",
    name: "Еда и отдых",
    image: images.food,
    description:
      "Выберите место для встречи, отдыха или небольшого путешествия.",
    children: [
      { id: "restaurants", name: "Рестораны", image: images.food },
      { id: "cafes", name: "Кафе", image: images.food },
      { id: "hotels", name: "Отели", image: images.hotel },
      { id: "tours", name: "Экскурсии", image: images.travel },
      { id: "weekend", name: "Отдых за городом", image: images.hotel },
    ],
  },
  {
    id: "auto-services",
    name: "Уход за авто",
    image: images.autoRepair,
    description: "Обслуживание и уход за автомобилем.",
    children: [
      { id: "repair", name: "Автосервис", image: images.autoRepair },
      { id: "detailing", name: "Детейлинг", image: images.detailing },
      { id: "wash", name: "Автомойка", image: images.detailing },
      { id: "tires", name: "Шиномонтаж", image: images.parts },
      { id: "parts", name: "Запчасти", image: images.parts },
    ],
  },
];

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
