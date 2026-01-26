// Типы — подняты наверх
export interface Provider {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  image: string;
  smallIcon: string;
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
  image: string;
  color: string;
  providers: Provider[];
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
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
    // large image for service details (Unsplash placeholder)
    image: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80&ixlib=rb-4.0.3&sat=10&bg=fff`,
    // small icon for main list (used on main screen) (Unsplash small)
    smallIcon: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=64&q=80&ixlib=rb-4.0.3&sat=10&bg=fff`,
    price: 500 + Math.floor(Math.random() * 2000),
    description: `Описание для ${specialization} ${i + 1}`,
    whatsappPhone: `+7900${String(1000000 + i).slice(0, 7)}`,
    telegramUsername: `@${specialization.toLowerCase()}${i + 1}`,
    phoneNumber: `+7900${String(2000000 + i).slice(0, 7)}`,
  }));
}

// Ensure each service category has at least 10 providers (safety check)
// If any category was created differently, regenerate providers to keep count consistent.
// This runs at module initialization and mutates the exported array items.
// Note: most categories already use `generateProviders`, so this is just a safeguard.
export const ensureTenProviders = () => {
  serviceCategories.forEach((cat, idx) => {
    if (!cat.providers || cat.providers.length < 10) {
      const prefix = `sp${idx + 1}_`;
      cat.providers = generateProviders(prefix, cat.name);
    }
  });
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Ремонт и обслуживание",
    icon: "construct", // Валидная иконка Ionicons
    image: "construct",
    color: "#576A8F",
    providers: generateProviders("sp1_", "Сантехник"),
  },
  {
    id: "2",
    name: "Медицинские услуги",
    icon: "medical",
    image: "medical",
    color: "#30364F",
    providers: generateProviders("sp2_", "Врач"),
  },
  {
    id: "3",
    name: "Букеты и подарки",
    icon: "gift",
    image: "gift",
    color: "#656D3F",
    providers: generateProviders("sp3_", "Флорист"),
  },
  {
    id: "4",
    name: "Красота и уход",
    icon: "cut", // scissors icon, use cut.png
    image: "cut",
    color: "#296374",
    providers: generateProviders("sp4_", "Стилист"),
  },
  {
    id: "5",
    name: "Клининг",
    icon: "sparkles", // sparkles icon, use cleaning.png
    image: "sparkles",
    color: "#574964",
    providers: generateProviders("sp5_", "Клинер"),
  },
  {
    id: "6",
    name: "Химчистка",
    icon: "water", // water icon, use dryclean.png
    image: "water",
    color: "#36656B",
    providers: generateProviders("sp6_", "Химчистка"),
  },
  {
    id: "7",
    name: "Ремонт авто",
    icon: "car-sport", // car-sport icon, use autorepair.png
    image: "autorepair",
    color: "#E5BA41",
    providers: generateProviders("sp7_", "Автомеханик"),
  },
  {
    id: "8",
    name: "Перевозки",
    icon: "car", // car-outline icon, use cars.png
    image: "car",
    color: "#75B06F",
    providers: generateProviders("sp8_", "Водитель"),
  },
  {
    id: "9",
    name: "Туры с гидом",
    icon: "map",
    image: "map",
    color: "#005461",
    providers: generateProviders("sp9_", "Гид"),
  },
  {
    id: "10",
    name: "Детейлинг",
    icon: "car-sport",
    image: "detailing",
    color: "#D97706",
    providers: generateProviders("sp10_", "Детейлинг"),
  },
];

export const shopCategories: ShopCategory[] = [
  {
    id: "sc1",
    name: "Магазины продуктов",
    icon: "bag",
    image: "bag",
    color: "#576A8F",
    shops: [
      {
        id: "shop1",
        name: 'Супермаркет "Вкусная жизнь"',
        category: "Продукты",
        image:
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=300&q=80",
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
        image:
          "https://images.unsplash.com/photo-1510557880182-3b77e9c8b1b1?auto=format&fit=crop&w=300&q=80",
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
    image: "sports_nutrition",
    color: "#30364F",
    shops: [
      {
        id: "shop10",
        name: "SportFood",
        category: "Спортивное питание",
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80",
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
    image: "shirt",
    color: "#656D3F",
    shops: [
      {
        id: "shop11",
        name: "FashionStyle",
        category: "Одежда и обувь",
        image:
          "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=300&q=80",
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
    image: "phone",
    color: "#296374",
    shops: [
      {
        id: "shop2",
        name: "Электроника Pro",
        category: "Электроника",
        image:
          "https://images.unsplash.com/photo-1510557880182-3b77e9c8b1b1?auto=format&fit=crop&w=300&q=80",
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
    image: "pharm",
    color: "#574964",
    shops: [
      {
        id: "shop5",
        name: 'Аптека "Здоровье"',
        category: "Лекарства",
        image:
          "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=300&q=80",
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
        image:
          "https://images.unsplash.com/photo-1582719478250-9b1b9b4f9f2b?auto=format&fit=crop&w=300&q=80",
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
    image: "settings",
    color: "#36656B",
    shops: [
      {
        id: "shop12",
        name: "АвтоДеталь",
        category: "Автозапчасти",
        image:
          "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=300&q=80",
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
    icon: "car-outline",
    image: "cars",
    color: "#E5BA41",
    shops: [
      {
        id: "shop13",
        name: "АвтоГрад",
        category: "Автосалон",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80",
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
    image: "restaurant",
    color: "#75B06F",
    shops: [
      {
        id: "shop3",
        name: 'Ресторан "Вкусная еда"',
        category: "Итальянская кухня",
        image:
          "https://images.unsplash.com/photo-1541542684-4b0b1e4f3d6f?auto=format&fit=crop&w=300&q=80",
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
        image:
          "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=300&q=80",
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
    image: "bed",
    color: "#005461",
    shops: [
      {
        id: "shop8",
        name: "Отель Прима",
        category: "Проживание",
        image:
          "https://images.unsplash.com/photo-1505691723518-36a5b0d1b38e?auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviewCount: 567,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 5000,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
  {
    id: "sc10",
    name: "Недвижимость",
    icon: "home",
    image: "home",
    color: "#E67E22",
    shops: [
      {
        id: "shop20",
        name: "Агентство 'Город'",
        category: "Продажа квартир",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
        rating: 4.9,
        reviewCount: 210,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 0,
        freeDelivery: false,
        isPromoted: true,
      },
      {
        id: "shop21",
        name: "Жильё+",
        category: "Аренда недвижимости",
        image:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80",
        rating: 4.7,
        reviewCount: 145,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 0,
        freeDelivery: false,
        isPromoted: false,
      },
      {
        id: "shop22",
        name: "Новостройки",
        category: "Новостройки",
        image:
          "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviewCount: 98,
        deliveryTime: { min: 0, max: 0 },
        minimumOrder: 0,
        freeDelivery: false,
        isPromoted: false,
      },
    ],
  },
];

// Helper: generate a shop object
function makeShop(prefix: string, index: number, categoryName: string): Shop {
  return {
    id: `${prefix}${index + 1}`,
    name: `${categoryName} ${index + 1}`,
    category: categoryName,
    image: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80`,
    rating: +(4 + Math.random()).toFixed(1),
    reviewCount: Math.floor(5 + Math.random() * 500),
    deliveryTime: { min: 20, max: 60 },
    minimumOrder: Math.floor(Math.random() * 1000),
    freeDelivery: false,
    isPromoted: false,
  };
}

// Ensure each shop category has 10 shops by appending generated shops when needed.
export const ensureTenShops = () => {
  shopCategories.forEach((cat, catIdx) => {
    const prefix = `sc${catIdx + 1}_`;
    while (cat.shops.length < 10) {
      const nextIndex = cat.shops.length;
      cat.shops.push(makeShop(prefix, nextIndex, cat.name));
    }
  });
};

// Run safety checks at module init
ensureTenProviders();
ensureTenShops();

export const products: Product[] = [
  {
    id: "prod1",
    shopId: "shop1",
    name: "Хлеб ржаной",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1544937954-8f7ce3f37724?auto=format&fit=crop&w=120&q=80",
    rating: 4.7,
  },
  {
    id: "prod2",
    shopId: "shop1",
    name: "Молоко 1 литр",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=120&q=80",
    rating: 4.8,
  },
  {
    id: "prod3",
    shopId: "shop2",
    name: "iPhone 15",
    price: 89900,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80",
    rating: 4.9,
  },
  {
    id: "prod4",
    shopId: "shop2",
    name: "AirPods Pro",
    price: 28990,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=120&q=80",
    rating: 4.8,
  },
  {
    id: "prod5",
    shopId: "shop3",
    name: "Футболка хлопок",
    price: 1290,
    image:
      "https://images.unsplash.com/photo-1520975919905-6a6b5a3b0b00?auto=format&fit=crop&w=120&q=80",
    rating: 4.6,
  },
  {
    id: "prod6",
    shopId: "shop3",
    name: "Джинсы классические",
    price: 2990,
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=120&q=80",
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
  {
    id: "4",
    title: "Скидка на химчистку",
    description: "Скидка 15% на химчистку мебели и ковров!",
    badge: "Скидка",
    buttonText: "Записаться",
    icon: "water-outline",
    iconColor: "#4DD0E1",
    gradient: ["#4DD0E1", "#81C784"],
  },
  {
    id: "5",
    title: "Стилист на дом",
    description: "Вызовите стилиста домой — быстро и удобно.",
    badge: "Услуга",
    buttonText: "Вызвать",
    icon: "cut-outline",
    iconColor: "#F48FB1",
    gradient: ["#F48FB1", "#667eea"],
  },
  {
    id: "6",
    title: "Ремонт авто за 1 день",
    description: "Срочный ремонт авто — запись онлайн.",
    badge: "Авто",
    buttonText: "Подробнее",
    icon: "car-sport-outline",
    iconColor: "#90CAF9",
    gradient: ["#90CAF9", "#64b5f6"],
  },
  {
    id: "7",
    title: "Экскурсии по городу",
    description: "Лучшие гиды и туры для всей семьи.",
    badge: "Туры",
    buttonText: "Записаться",
    icon: "map-outline",
    iconColor: "#81C784",
    gradient: ["#81C784", "#64b5f6"],
  },
  {
    id: "8",
    title: "Подарки и букеты",
    description: "Доставка свежих цветов и подарков за 2 часа.",
    badge: "Подарки",
    buttonText: "Выбрать",
    icon: "gift-outline",
    iconColor: "#FFB6C1",
    gradient: ["#FFB6C1", "#667eea"],
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
  {
    id: "5",
    title: "Красота",
    icon: "cut-outline",
    color: "#F48FB1",
  },
  {
    id: "6",
    title: "Химчистка",
    icon: "water-outline",
    color: "#4DD0E1",
  },
  {
    id: "7",
    title: "Авто",
    icon: "car-sport-outline",
    color: "#90CAF9",
  },
  {
    id: "8",
    title: "Гид/Туры",
    icon: "map-outline",
    color: "#81C784",
  },
  {
    id: "9",
    title: "Аптеки",
    icon: "medkit-outline",
    color: "#BCBBC1",
  },
  {
    id: "10",
    title: "Подарки",
    icon: "gift-outline",
    color: "#FFB6C1",
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
