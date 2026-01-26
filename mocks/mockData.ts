// Типы — подняты наверх
export interface Provider {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  image: string;
  price: number;
  description: string;
  whatsappPhone: string;
  telegramUsername: string;
  phoneNumber: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  providers: Provider[];
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  shops: Shop[];
}

export interface DeliveryTime {
  min: number;
  max: number;
}

export interface Shop {
  freeDelivery: any;
  isPromoted: any;
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: DeliveryTime;
  minimumOrder: number;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: "completed" | "in_progress" | "pending";
  totalAmount: number;
  createdAt: string;
  estimatedDeliveryTime: string;
  items: OrderItem[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  badge: string;
  buttonText: string;
  icon: string;
  iconColor: string;
  gradient: string[];
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
}

// Генератор провайдеров для моковых категорий
function generateProviders(prefix: string, specialization: string): Provider[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    name: `${specialization} ${i + 1}`,
    specialization,
    rating: +(4.5 + Math.random() * 0.5).toFixed(1),
    reviewCount: Math.floor(50 + Math.random() * 200),
    image: `https://placehold.jp/100x100.png?text=${encodeURIComponent(
      specialization,
    )}+${i + 1}`,
    price: 500 + Math.floor(Math.random() * 2000),
    description: `Описание для ${specialization} ${i + 1}`,
    whatsappPhone: `+7900${String(1000000 + i).slice(0, 7)}`,
    telegramUsername: `@${specialization.toLowerCase()}${i + 1}`,
    phoneNumber: `+7900${String(2000000 + i).slice(0, 7)}`,
  }));
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Ремонт и обслуживание",
    icon: "construct", // Валидная иконка Ionicons
    color: "#9AA9C0",
    providers: generateProviders("sp1_", "Сантехник"),
  },
  {
    id: "2",
    name: "Медицинские услуги",
    icon: "medical",
    color: "#BCBBC1",
    providers: generateProviders("sp2_", "Врач"),
  },
  {
    id: "3",
    name: "Букеты и подарки",
    icon: "gift",
    color: "#FFB6C1",
    providers: generateProviders("sp3_", "Флорист"),
  },
  {
    id: "4",
    name: "Красота и уход",
    icon: "cut", // scissors icon, use cut.png
    color: "#F48FB1",
    providers: generateProviders("sp4_", "Стилист"),
  },
  {
    id: "5",
    name: "Клининг",
    icon: "sparkles", // sparkles icon, use cleaning.png
    color: "#64b5f6",
    providers: generateProviders("sp5_", "Клинер"),
  },
  {
    id: "6",
    name: "Химчистка",
    icon: "water", // water icon, use dryclean.png
    color: "#4DD0E1",
    providers: generateProviders("sp6_", "Химчистка"),
  },
  {
    id: "7",
    name: "Ремонт авто",
    icon: "car-sport", // car-sport icon, use autorepair.png
    color: "#90CAF9",
    providers: generateProviders("sp7_", "Автомеханик"),
  },
  {
    id: "8",
    name: "Перевозки",
    icon: "car", // car-outline icon, use cars.png
    color: "#BCBBC1",
    providers: generateProviders("sp8_", "Водитель"),
  },
  {
    id: "9",
    name: "Туры с гидом",
    icon: "map",
    color: "#81C784",
    providers: generateProviders("sp9_", "Гид"),
  },
];

export const shopCategories: ShopCategory[] = [
  {
    id: "sc1",
    name: "Магазины продуктов",
    icon: "bag",
    color: "#9AA9C0",
    shops: [
      {
        id: "shop1",
        name: 'Супермаркет "Вкусная жизнь"',
        category: "Продукты",
        image: "https://placehold.jp/150x150.png?text=Supermarket",
        rating: 4.6,
        reviewCount: 234,
        deliveryTime: { min: 30, max: 45 },
        minimumOrder: 500,
        freeDelivery: false,
        isPromoted: false,
      },
      {
        id: "shop2",
        name: "Электроника Pro",
        category: "Электроника",
        image: "https://placehold.jp/150x150.png?text=Electronics",
        rating: 4.5,
        reviewCount: 189,
        deliveryTime: { min: 60, max: 120 },
        minimumOrder: 1000,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc2",
    name: "Спортивное питание",
    icon: "sports_nutrition",
    color: "#81C784",
    shops: [
      {
        id: "shop10",
        name: "SportFood",
        category: "Спортивное питание",
        image: "https://placehold.jp/150x150.png?text=SportFood",
        rating: 4.8,
        reviewCount: 120,
        deliveryTime: { min: 20, max: 40 },
        minimumOrder: 700,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc3",
    name: "Одежда и обувь",
    icon: "shirt",
    color: "#FBC02D",
    shops: [
      {
        id: "shop11",
        name: "FashionStyle",
        category: "Одежда и обувь",
        image: "https://placehold.jp/150x150.png?text=FashionStyle",
        rating: 4.7,
        reviewCount: 98,
        deliveryTime: { min: 30, max: 60 },
        minimumOrder: 1000,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc4",
    name: "Смартфоны и техника",
    icon: "phone",
    color: "#64b5f6",
    shops: [
      {
        id: "shop2",
        name: "Электроника Pro",
        category: "Электроника",
        image: "https://placehold.jp/150x150.png?text=Electronics",
        rating: 4.5,
        reviewCount: 189,
        deliveryTime: { min: 60, max: 120 },
        minimumOrder: 1000,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc5",
    name: "Аптеки",
    icon: "pharm",
    color: "#9AA9C0",
    shops: [
      {
        id: "shop5",
        name: 'Аптека "Здоровье"',
        category: "Лекарства",
        image: "https://placehold.jp/150x150.png?text=Pharmacy",
        rating: 4.9,
        reviewCount: 456,
        deliveryTime: { min: 15, max: 30 },
        minimumOrder: 200,
        freeDelivery: false,
        isPromoted: false,
      },
      {
        id: "shop6",
        name: 'Аптека "Плюс"',
        category: "Витамины",
        image: "https://placehold.jp/150x150.png?text=Pharmacy2",
        rating: 4.6,
        reviewCount: 189,
        deliveryTime: { min: 20, max: 35 },
        minimumOrder: 250,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc6",
    name: "Автозапчасти",
    icon: "settings",
    color: "#90CAF9",
    shops: [
      {
        id: "shop12",
        name: "АвтоДеталь",
        category: "Автозапчасти",
        image: "https://placehold.jp/150x150.png?text=АвтоДеталь",
        rating: 4.7,
        reviewCount: 77,
        deliveryTime: { min: 40, max: 90 },
        minimumOrder: 500,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc7",
    name: "Автосалоны",
    icon: "car-sport",
    color: "#BCBBC1",
    shops: [
      {
        id: "shop13",
        name: "АвтоГрад",
        category: "Автосалон",
        image: "https://placehold.jp/150x150.png?text=АвтоГрад",
        rating: 4.8,
        reviewCount: 65,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 0,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc8",
    name: "Рестораны",
    icon: "restaurant",
    color: "#BCBBC1",
    shops: [
      {
        id: "shop3",
        name: 'Ресторан "Вкусная еда"',
        category: "Итальянская кухня",
        image: "https://placehold.jp/150x150.png?text=Restaurant",
        rating: 4.8,
        reviewCount: 312,
        deliveryTime: { min: 30, max: 60 },
        minimumOrder: 800,
        freeDelivery: false,
        isPromoted: false,
      },
      {
        id: "shop4",
        name: 'Кафе "Уют"',
        category: "Кофейня",
        image: "https://placehold.jp/150x150.png?text=Cafe",
        rating: 4.7,
        reviewCount: 267,
        deliveryTime: { min: 20, max: 40 },
        minimumOrder: 300,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc9",
    name: "Отели",
    icon: "bed",
    color: "#9AA9C0",
    shops: [
      {
        id: "shop8",
        name: "Отель Прима",
        category: "Проживание",
        image: "https://placehold.jp/150x150.png?text=Hotel",
        rating: 4.8,
        reviewCount: 567,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 5000,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
];

export const products: Product[] = [
  {
    id: "prod1",
    shopId: "shop1",
    name: "Хлеб ржаной",
    price: 85,
    image: "https://placehold.jp/120x120.png?text=Хлеб",
    rating: 4.7,
  },
  {
    id: "prod2",
    shopId: "shop1",
    name: "Молоко 1 литр",
    price: 95,
    image: "https://placehold.jp/120x120.png?text=Молоко",
    rating: 4.8,
  },
  {
    id: "prod3",
    shopId: "shop2",
    name: "iPhone 15",
    price: 89900,
    image: "https://placehold.jp/120x120.png?text=iPhone",
    rating: 4.9,
  },
  {
    id: "prod4",
    shopId: "shop2",
    name: "AirPods Pro",
    price: 28990,
    image: "https://placehold.jp/120x120.png?text=AirPods",
    rating: 4.8,
  },
  {
    id: "prod5",
    shopId: "shop3",
    name: "Футболка хлопок",
    price: 1290,
    image: "https://placehold.jp/120x120.png?text=Футболка",
    rating: 4.6,
  },
  {
    id: "prod6",
    shopId: "shop3",
    name: "Джинсы классические",
    price: 2990,
    image: "https://placehold.jp/120x120.png?text=Джинсы",
    rating: 4.7,
  },
];

export const orders: Order[] = [
  {
    id: "ord1",
    status: "completed",
    totalAmount: 2500,
    createdAt: "2024-12-19T10:00:00Z",
    estimatedDeliveryTime: "2024-12-19T12:00:00Z",
    items: [
      { name: "Молоко 1 литр", quantity: 2, price: 95 },
      { name: "Хлеб ржаной", quantity: 1, price: 85 },
    ],
  },
  {
    id: "ord2",
    status: "in_progress",
    totalAmount: 5980,
    createdAt: "2024-12-24T12:00:00Z",
    estimatedDeliveryTime: "2024-12-24T12:30:00Z",
    items: [
      { name: "Футболка хлопок", quantity: 2, price: 1290 },
      { name: "Джинсы классические", quantity: 1, price: 2990 },
    ],
  },
  {
    id: "ord3",
    status: "pending",
    totalAmount: 28990,
    createdAt: "2024-12-24T13:30:00Z",
    estimatedDeliveryTime: "2024-12-24T15:30:00Z",
    items: [{ name: "AirPods Pro", quantity: 1, price: 28990 }],
  },
];

export const reviews: Review[] = [
  {
    id: "rev1",
    rating: 5,
    comment: "Отличный сантехник! Быстро и профессионально решил проблему.",
    author: "Иван К.",
    createdAt: "2024-12-21T10:00:00Z",
  },
  {
    id: "rev2",
    rating: 4,
    comment: "Хорошая работа, слегка задержался с приездом.",
    author: "Мария П.",
    createdAt: "2024-12-19T10:00:00Z",
  },
  {
    id: "rev3",
    rating: 5,
    comment: "Превосходный результат! Рекомендую друзьям.",
    author: "Петр В.",
    createdAt: "2024-12-17T10:00:00Z",
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "1",
    title: "Скидка 20% на уборку",
    description: "Только до конца недели — закажите уборку со скидкой!",
    badge: "Акция",
    buttonText: "Подробнее",
    icon: "sparkles-outline",
    iconColor: "#FFF176",
    gradient: ["#667eea", "#64b5f6"],
  },
  {
    id: "2",
    title: "Бесплатная доставка",
    description:
      "Оформите заказ в магазинах-партнёрах и получите бесплатную доставку.",
    badge: "Доставка",
    buttonText: "В магазин",
    icon: "bicycle-outline",
    iconColor: "#FF8A65",
    gradient: ["#43cea2", "#185a9d"],
  },
  {
    id: "3",
    title: "Новые мастера",
    description: "Попробуйте услуги новых мастеров с дополнительной скидкой.",
    badge: "Новое",
    buttonText: "К мастерам",
    icon: "person-add-outline",
    iconColor: "#BA68C8",
    gradient: ["#ff758c", "#ff7eb3"],
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Уборка",
    icon: "sparkles-outline",
    color: "#667eea",
  },
  {
    id: "2",
    title: "Доставка",
    icon: "bicycle-outline",
    color: "#43cea2",
  },
  {
    id: "3",
    title: "Ремонт",
    icon: "construct-outline",
    color: "#ff758c",
  },
  {
    id: "4",
    title: "Магазины",
    icon: "storefront-outline",
    color: "#9C27B0",
  },
];

export const fetchMockData = (resource: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (resource === "serviceCategories") return resolve(serviceCategories);
      if (resource === "shopCategories") return resolve(shopCategories);
      if (resource === "products") return resolve(products);
      if (resource === "orders") return resolve(orders);
      if (resource === "reviews") return resolve(reviews);
      if (resource === "promoBanners") return resolve(promoBanners);
      if (resource === "quickActions") return resolve(quickActions);
      resolve([]);
    }, 2000);
  });
};
