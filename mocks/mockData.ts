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

export interface MockDataType {
  serviceCategories: ServiceCategory[];
  shopCategories: ShopCategory[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
}

export const mockData: MockDataType = {
  serviceCategories: [
    {
      id: "1",
      name: "Ремонт и обслуживание",
      icon: "construct", // Валидная иконка Ionicons
      color: "#9AA9C0",
      providers: [
        {
          id: "sp1",
          name: "Иван Петров",
          specialization: "Сантехник",
          rating: 4.8,
          reviewCount: 127,
          image: "https://placehold.co/100x100?text=Иван",
          price: 500,
          description: "Опытный сантехник с 10 летним стажем",
          whatsappPhone: "+79001234567",
          telegramUsername: "@ivan_santehnik",
          phoneNumber: "+79001234567",
        },
        {
          id: "sp2",
          name: "Сергей Сидоров",
          specialization: "Сантехник",
          rating: 4.6,
          reviewCount: 89,
          image: "https://placehold.co/100x100?text=Сергей",
          price: 450,
          description: "Специалист по водоснабжению и канализации",
          whatsappPhone: "+79007654321",
          telegramUsername: "@sergey_s",
          phoneNumber: "+79007654321",
        },
        {
          id: "sp3",
          name: "Александр Волков",
          specialization: "Электрик",
          rating: 4.9,
          reviewCount: 156,
          image: "https://placehold.co/100x100?text=Александр",
          price: 600,
          description: "Мастер электрических работ всех видов",
          whatsappPhone: "+79003334444",
          telegramUsername: "@alex_electric",
          phoneNumber: "+79003334444",
        },
        {
          id: "sp4",
          name: "Дмитрий Орлов",
          specialization: "Электрик",
          rating: 4.7,
          reviewCount: 102,
          image: "https://placehold.co/100x100?text=Дмитрий",
          price: 550,
          description: "Электромонтаж, диагностика и ремонт",
          whatsappPhone: "+79005556666",
          telegramUsername: "@dmitry_electric",
          phoneNumber: "+79005556666",
        },
      ],
    },
    {
      id: "2",
      name: "Медицинские услуги",
      icon: "medical",
      color: "#BCBBC1",
      providers: [
        {
          id: "sp5",
          name: "Мария Кузнецова",
          specialization: "Терапевт",
          rating: 4.9,
          reviewCount: 203,
          image: "https://placehold.co/100x100?text=Мария",
          price: 1000,
          description: "Врач-терапевт высшей категории",
          whatsappPhone: "+79002223333",
          telegramUsername: "@maria_doctor",
          phoneNumber: "+79002223333",
        },
        {
          id: "sp6",
          name: "Анатолий Смирнов",
          specialization: "Кардиолог",
          rating: 4.8,
          reviewCount: 178,
          image: "https://placehold.co/100x100?text=Анатолий",
          price: 1500,
          description: "Кардиолог с 15 летним опытом",
          whatsappPhone: "+79004445555",
          telegramUsername: "@anatoly_cardio",
          phoneNumber: "+79004445555",
        },
      ],
    },
<<<<<<< HEAD
=======
    {
      id: "3",
      name: "Букеты и подарки",
      icon: "gift",
      color: "#FFB6C1",
      providers: [
        {
          id: "sp7",
          name: "Цветочный рай",
          specialization: "Флористика",
          rating: 4.9,
          reviewCount: 245,
          image: "https://placehold.co/100x100?text=Цветы",
          price: 800,
          description: "Свежие цветы и оригинальные букеты на любой случай",
          whatsappPhone: "+79006667777",
          telegramUsername: "@flower_paradise",
          phoneNumber: "+79006667777",
        },
        {
          id: "sp8",
          name: "Магия подарков",
          specialization: "Подарки",
          rating: 4.8,
          reviewCount: 198,
          image: "https://placehold.co/100x100?text=Подарки",
          price: 1200,
          description: "Уникальные подарки для близких и коллег",
          whatsappPhone: "+79007778888",
          telegramUsername: "@gift_magic",
          phoneNumber: "+79007778888",
        },
        {
          id: "sp9",
          name: "Букет & Презент",
          specialization: "Цветы и подарки",
          rating: 4.7,
          reviewCount: 167,
          image: "https://placehold.co/100x100?text=Букет",
          price: 950,
          description: "Комплексные решения: цветы + подарок в одном месте",
          whatsappPhone: "+79008889999",
          telegramUsername: "@bouquet_present",
          phoneNumber: "+79008889999",
        },
      ],
    },
>>>>>>> 40bffbf (- поменял навигация категории)
  ],
  shopCategories: [
    {
      id: "sc1",
      name: "Магазины",
      icon: "bag",
      color: "#9AA9C0",
      shops: [
        {
          id: "shop1",
          name: 'Супермаркет "Вкусная жизнь"',
          category: "Продукты",
          image: "https://placehold.co/150x150?text=Supermarket",
          rating: 4.6,
          reviewCount: 234,
          deliveryTime: { min: 30, max: 45 },
          minimumOrder: 500,
        },
        {
          id: "shop2",
          name: "Электроника Pro",
          category: "Электроника",
          image: "https://placehold.co/150x150?text=Electronics",
          rating: 4.5,
          reviewCount: 189,
          deliveryTime: { min: 60, max: 120 },
          minimumOrder: 1000,
        },
      ],
    },
    {
      id: "sc2",
      name: "Рестораны",
      icon: "restaurant",
      color: "#BCBBC1",
      shops: [
        {
          id: "shop3",
          name: 'Ресторан "Вкусная еда"',
          category: "Итальянская кухня",
          image: "https://placehold.co/150x150?text=Restaurant",
          rating: 4.8,
          reviewCount: 312,
          deliveryTime: { min: 30, max: 60 },
          minimumOrder: 800,
        },
        {
          id: "shop4",
          name: 'Кафе "Уют"',
          category: "Кофейня",
          image: "https://placehold.co/150x150?text=Cafe",
          rating: 4.7,
          reviewCount: 267,
          deliveryTime: { min: 20, max: 40 },
          minimumOrder: 300,
        },
      ],
    },
    {
      id: "sc3",
      name: "Аптеки",
      icon: "pharm",
      color: "#9AA9C0",
      shops: [
        {
          id: "shop5",
          name: 'Аптека "Здоровье"',
          category: "Лекарства",
          image: "https://placehold.co/150x150?text=Pharmacy",
          rating: 4.9,
          reviewCount: 456,
          deliveryTime: { min: 15, max: 30 },
          minimumOrder: 200,
        },
        {
          id: "shop6",
          name: 'Аптека "Плюс"',
          category: "Витамины",
          image: "https://placehold.co/150x150?text=Pharmacy2",
          rating: 4.6,
          reviewCount: 189,
          deliveryTime: { min: 20, max: 35 },
          minimumOrder: 250,
        },
      ],
    },
    {
      id: "sc4",
      name: "Такси",
      icon: "car",
      color: "#BCBBC1",
      shops: [
        {
          id: "shop7",
          name: "Яндекс.Такси",
          category: "Транспорт",
          image: "https://placehold.co/150x150?text=Taxi",
          rating: 4.7,
          reviewCount: 1230,
          deliveryTime: { min: 5, max: 15 },
          minimumOrder: 100,
        },
      ],
    },
    {
      id: "sc5",
      name: "Отели",
      icon: "bed",
      color: "#9AA9C0",
      shops: [
        {
          id: "shop8",
          name: "Отель Прима",
          category: "Проживание",
          image: "https://placehold.co/150x150?text=Hotel",
          rating: 4.8,
          reviewCount: 567,
          deliveryTime: { min: 0, max: 0 },
          minimumOrder: 5000,
        },
      ],
    },
    {
      id: "sc6",
      name: "Туры с гидом",
      icon: "map",
      color: "#BCBBC1",
      shops: [
        {
          id: "shop9",
          name: "Туристическое агентство",
          category: "Экскурсии",
          image: "https://placehold.co/150x150?text=Tours",
          rating: 4.9,
          reviewCount: 234,
          deliveryTime: { min: 0, max: 0 },
          minimumOrder: 2000,
        },
      ],
    },
  ],
  products: [
    {
      id: "prod1",
      shopId: "shop1",
      name: "Хлеб ржаной",
      price: 85,
      image: "https://placehold.co/120x120?text=Хлеб",
      rating: 4.7,
    },
    {
      id: "prod2",
      shopId: "shop1",
      name: "Молоко 1 литр",
      price: 95,
      image: "https://placehold.co/120x120?text=Молоко",
      rating: 4.8,
    },
    {
      id: "prod3",
      shopId: "shop2",
      name: "iPhone 15",
      price: 89900,
      image: "https://placehold.co/120x120?text=iPhone",
      rating: 4.9,
    },
    {
      id: "prod4",
      shopId: "shop2",
      name: "AirPods Pro",
      price: 28990,
      image: "https://placehold.co/120x120?text=AirPods",
      rating: 4.8,
    },
    {
      id: "prod5",
      shopId: "shop3",
      name: "Футболка хлопок",
      price: 1290,
      image: "https://placehold.co/120x120?text=Футболка",
      rating: 4.6,
    },
    {
      id: "prod6",
      shopId: "shop3",
      name: "Джинсы классические",
      price: 2990,
      image: "https://placehold.co/120x120?text=Джинсы",
      rating: 4.7,
    },
  ],
  orders: [
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
  ],
  reviews: [
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
  ],
};

// Simulated API with delay
export const fetchMockData = (resource: keyof MockDataType): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockData[resource] || [];
      console.log(`Fetching ${resource}:`, data.length, "items");
      resolve(data);
    }, 500); // Уменьшил задержку с 2000 до 500мс для быстрой загрузки
  });
};
