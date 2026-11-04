# Архитектура allin

> Этот документ содержит продуктовую концепцию и планы. Фактическая структура кода описана в [docs/architecture.md](docs/architecture.md), каталог документации — [docs/README.md](docs/README.md).

## Обзор системы

Система состоит из двух основных приложений:
1. **Client App** - мобильное приложение для клиентов/покупателей
2. **Provider App** - мобильное приложение для исполнителей (провайдеры сервисов, магазины, рестораны, таксисты, гостиницы, гиды)

---

## 1. CLIENT APP (Приложение для клиентов)

### 1.1 Структура: Feature-ориентированная архитектура

**5 ОСНОВНЫХ ТАБОВ:**

```
┌─────────────────────────────────────────┐
│                                         │
│          (Основной контент)             │
│                                         │
├─────────────────────────────────────────┤
│  🏠    🔍    📦    ⚙️    👤              │
│ Home  Search Orders Services Profile    │
└─────────────────────────────────────────┘

ТАБ 1: HOME 🏠
├─ Рекомендации и персонализированные предложения
├─ Быстрые ссылки на популярные сервисы
├─ Популярные магазины
├─ Баннеры с акциями
└─ Новые рестораны и туры

ТАБ 2: SEARCH 🔍 (Поиск и фильтры)
├─ Глобальный поиск по всем категориям
├─ Фильтры и сортировка
└─ Результаты поиска (все категории)

ТАБ 3: ORDERS 📦 (Заказы и отслеживание)
├─ Активные заказы (товары, еда)
├─ Активные поездки (такси, курьер)
├─ Активные бронирования (сервисы, номера, туры)
├─ Отслеживание доставки (реал-тайм)
├─ Статусы всех заказов
└─ История заказов

ТАБ 4: SERVICES ⚙️ (ВСЕ СЕРВИСЫ/УСЛУГИ ПРИЛОЖЕНИЯ)
Единая централизованная точка для всех услуг приложения:
├─ 🔧 Сантехник
├─ ⚡ Электрик
├─ 👨‍⚕️ Доктор
├─ 🛍️ Магазины (товары, продукты, электроника и т.д)
├─ 🍽️ Рестораны (доставка еды)
├─ 🚕 Такси
├─ 🏨 Гостиницы (жилье, апартаменты и т.д)
└─ 🗺️ Туры (экскурсии с гидами)

Для каждой услуги:
├─ Список провайдеров
├─ Рейтинг и отзывы
├─ Описание и параметры
└─ Контакты (WhatsApp, Telegram, Phone)

ТАБ 5: PROFILE 👤 (Профиль и настройки)
├─ Данные профиля
├─ Мои адреса
├─ Способы оплаты
├─ Избранные провайдеры
├─ Мои отзывы
└─ Настройки приложения
```

### 1.2 Структура папок: Feature-Driven Architecture

```
client-app/
├── app/                          # Expo Router экраны (навигация)
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Splash/Init
│   │
│   ├── (auth)/                  # Authentication group
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── role-select.tsx
│   │
│   └── (tabs)/                  # 5 основных табов
│       ├── _layout.tsx          # Tab navigation
│       ├── home.tsx             # ТАБ 1: Home
│       ├── search.tsx           # ТАБ 2: Search
│       ├── orders.tsx           # ТАБ 3: Orders
│       ├── services.tsx         # ТАБ 4: Services (все услуги/магазины/и т.д)
│       └── profile.tsx          # ТАБ 5: Profile
│
├── features/                     # ⭐️ FEATURE-ОРИЕНТИРОВАННАЯ СТРУКТУРА
│   │
│   ├── auth/                     # ФИЧА: Аутентификация
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── RoleSelectScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── utils/
│   │
│   ├── home/                     # ФИЧА: Главная страница
│   │   ├── screens/
│   │   │   └── HomeScreen.tsx
│   │   ├── components/
│   │   │   ├── RecommendationsSection.tsx
│   │   │   ├── FeaturedServicesSlider.tsx
│   │   │   ├── PopularShopsSection.tsx
│   │   │   ├── PromoBanner.tsx
│   │   │   └── CategoryQuickLinks.tsx
│   │   ├── types/
│   │   │   └── home.types.ts
│   │   ├── utils/
│   │   └── hooks/
│   │
│   ├── search/                   # ФИЧА: Поиск и фильтры
│   │   ├── screens/
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── SearchResultsScreen.tsx
│   │   │   └── FiltersScreen.tsx
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── SortOptions.tsx
│   │   │   └── ResultsList.tsx
│   │   ├── services/
│   │   │   └── search.service.ts
│   │   ├── types/
│   │   │   └── search.types.ts
│   │   └── hooks/
│   │       ├── useSearch.ts
│   │       └── useFilters.ts
│   │
│   ├── services/                 # ФИЧА: ВСЕ СЕРВИСЫ/УСЛУГИ
│   │   ├── screens/
│   │   │   ├── ServicesScreen.tsx # Все категории сервисов/услуг
│   │   │   ├── ServiceCategoryScreen.tsx # Детали категории
│   │   │   ├── ProviderDetailScreen.tsx # Профиль провайдера
│   │   │   └── ContactProviderScreen.tsx # Контакты (WhatsApp, Telegram, Phone)
│   │   ├── components/
│   │   │   ├── ServiceCategoryCard.tsx
│   │   │   ├── ProviderCard.tsx
│   │   │   ├── ContactButtons.tsx      # WhatsApp, Telegram, Phone
│   │   │   ├── ProviderRating.tsx
│   │   │   └── AvailabilitySchedule.tsx
│   │   ├── services/
│   │   │   ├── services.service.ts
│   │   │   ├── providers.service.ts
│   │   │   └── contacts.service.ts
│   │   ├── types/
│   │   │   ├── service.types.ts
│   │   │   └── provider.types.ts
│   │   └── hooks/
│   │       ├── useServices.ts
│   │       └── useProvider.ts
│   │
│   ├── shops/                    # ФИЧА: Магазины и товары
│   │   ├── screens/
│   │   │   ├── ShopsScreen.tsx
│   │   │   ├── ShopDetailScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   └── CartScreen.tsx
│   │   ├── components/
│   │   │   ├── ShopCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── CartItem.tsx
│   │   ├── services/
│   │   │   ├── shops.service.ts
│   │   │   ├── products.service.ts
│   │   │   └── cart.service.ts
│   │   ├── contexts/
│   │   │   └── CartContext.tsx
│   │   ├── types/
│   │   │   ├── shop.types.ts
│   │   │   ├── product.types.ts
│   │   │   └── cart.types.ts
│   │   └── hooks/
│   │       ├── useShops.ts
│   │       ├── useProducts.ts
│   │       └── useCart.ts
│   │
│   ├── restaurants/              # ФИЧА: Рестораны и доставка еды
│   │   ├── screens/
│   │   │   ├── RestaurantsScreen.tsx
│   │   │   ├── RestaurantDetailScreen.tsx
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── FoodDetailScreen.tsx
│   │   │   └── FoodCartScreen.tsx
│   │   ├── components/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── DishCard.tsx
│   │   │   ├── MenuCategory.tsx
│   │   │   └── FoodCartItem.tsx
│   │   ├── services/
│   │   │   ├── restaurants.service.ts
│   │   │   ├── dishes.service.ts
│   │   │   └── food-cart.service.ts
│   │   ├── contexts/
│   │   │   └── FoodCartContext.tsx
│   │   ├── types/
│   │   │   └── restaurant.types.ts
│   │   └── hooks/
│   │       ├── useRestaurants.ts
│   │       └── useFoodCart.ts
│   │
│   ├── taxi/                     # ФИЧА: Такси
│   │   ├── screens/
│   │   │   ├── TaxiBookingScreen.tsx
│   │   │   ├── MapBookingScreen.tsx
│   │   │   ├── ConfirmRideScreen.tsx
│   │   │   ├── ActiveRideScreen.tsx
│   │   │   └── RideHistoryScreen.tsx
│   │   ├── components/
│   │   │   ├── MapComponent.tsx
│   │   │   ├── PickupDropoffInput.tsx
│   │   │   ├── CarTypeSelector.tsx
│   │   │   ├── DriverInfo.tsx
│   │   │   └── LiveLocationTracker.tsx
│   │   ├── services/
│   │   │   ├── taxi.service.ts
│   │   │   ├── location.service.ts
│   │   │   └── tracking.service.ts
│   │   ├── types/
│   │   │   └── taxi.types.ts
│   │   └── hooks/
│   │       ├── useTaxiBooking.ts
│   │       ├── useLocation.ts
│   │       └── useRideTracking.ts
│   │
│   ├── hotels/                   # ФИЧА: Гостиницы
│   │   ├── screens/
│   │   │   ├── HotelsScreen.tsx
│   │   │   ├── HotelDetailScreen.tsx
│   │   │   ├── RoomsScreen.tsx
│   │   │   ├── RoomDetailScreen.tsx
│   │   │   └── BookingScreen.tsx
│   │   ├── components/
│   │   │   ├── HotelCard.tsx
│   │   │   ├── RoomCard.tsx
│   │   │   ├── AmenitiesList.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   └── GuestSelector.tsx
│   │   ├── services/
│   │   │   ├── hotels.service.ts
│   │   │   └── rooms.service.ts
│   │   ├── types/
│   │   │   └── hotel.types.ts
│   │   └── hooks/
│   │       ├── useHotels.ts
│   │       └── useHotelBooking.ts
│   │
│   ├── tours/                    # ФИЧА: Туры с гидами
│   │   ├── screens/
│   │   │   ├── ToursScreen.tsx
│   │   │   ├── TourDetailScreen.tsx
│   │   │   ├── GuideProfileScreen.tsx
│   │   │   └── TourBookingScreen.tsx
│   │   ├── components/
│   │   │   ├── TourCard.tsx
│   │   │   ├── GuideCard.tsx
│   │   │   ├── IncludedServices.tsx
│   │   │   └── ParticipantSelector.tsx
│   │   ├── services/
│   │   │   └── tours.service.ts
│   │   ├── types/
│   │   │   └── tour.types.ts
│   │   └── hooks/
│   │       └── useTours.ts
│   │
│   ├── orders/                   # ФИЧА: Заказы и отслеживание
│   │   ├── screens/
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── ActiveOrdersScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   ├── TrackingScreen.tsx
│   │   │   └── OrderHistoryScreen.tsx
│   │   ├── components/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── DeliveryTracker.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── OrderItemsList.tsx
│   │   ├── services/
│   │   │   ├── orders.service.ts
│   │   │   ├── deliveries.service.ts
│   │   │   └── bookings.service.ts
│   │   ├── types/
│   │   │   ├── order.types.ts
│   │   │   ├── delivery.types.ts
│   │   │   └── booking.types.ts
│   │   └── hooks/
│   │       ├── useOrders.ts
│   │       ├── useDeliveryTracking.ts
│   │       └── useBookings.ts
│   │
│   └── profile/                  # ФИЧА: Профиль и настройки
│       ├── screens/
│       │   ├── ProfileScreen.tsx
│       │   ├── EditProfileScreen.tsx
│       │   ├── AddressesScreen.tsx
│       │   ├── PaymentMethodsScreen.tsx
│       │   ├── FavoritesScreen.tsx
│       │   ├── ReviewsScreen.tsx
│       │   └── SettingsScreen.tsx
│       ├── components/
│       │   ├── ProfileHeader.tsx
│       │   ├── AddressCard.tsx
│       │   ├── PaymentMethodCard.tsx
│       │   ├── ReviewCard.tsx
│       │   └── SettingOption.tsx
│       ├── services/
│       │   ├── profile.service.ts
│       │   ├── addresses.service.ts
│       │   ├── payments.service.ts
│       │   └── reviews.service.ts
│       ├── contexts/
│       │   └── ProfileContext.tsx
│       ├── types/
│       │   └── profile.types.ts
│       └── hooks/
│           ├── useProfile.ts
│           └── useAddresses.ts
│
├── shared/                       # ОБЩИЕ РЕСУРСЫ (используются несколькими фичами)
│   ├── components/
│   │   ├── ui/                   # Base UI компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── ImageCarousel.tsx
│   │   │   └── StarRating.tsx
│   │   └── layouts/
│   │       ├── SafeAreaLayout.tsx
│   │       ├── ScreenLayout.tsx
│   │       └── BottomSheetLayout.tsx
│   ├── types/
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── error.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── storage.ts
│   │   ├── api-errors.ts
│   │   └── logger.ts
│   ├── services/
│   │   ├── api.ts                # Base API client
│   │   ├── notifications.ts
│   │   ├── analytics.ts
│   │   └── socket.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useAsync.ts
│   │   └── useForm.ts
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── AppContext.tsx
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── animations/
│   └── styles/
│       ├── theme.ts
│       ├── colors.ts
│       └── spacing.ts
│
├── app.json
├── package.json
├── tsconfig.json
└── ...
```

### 1.3 Преимущества Feature-Driven Architecture

✅ **Масштабируемость**
- Легко добавлять новые фичи
- Каждая фича независима

✅ **Модульность**
- Все необходимое для фичи в одной папке
- Легко найти и изменить код

✅ **Переиспользуемость**
- Shared папка содержит общие компоненты и утилиты
- Фичи могут делиться сервисами и типами через shared

✅ **Тестируемость**
- Каждая фича может тестироваться независимо
- Чистые границы между модулями

---

## 2. PROVIDER APP (Приложение для исполнителей)

### 2.1 Структура: Feature-Driven Architecture

```
provider-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── role-select.tsx      # Выбор типа провайдера
│   │   ├── verification.tsx
│   │   └── approval.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx        # ТАБ 1: Главная
│   │   ├── orders.tsx           # ТАБ 2: Заказы
│   │   ├── earnings.tsx         # ТАБ 3: Доходы
│   │   ├── analytics.tsx        # ТАБ 4: Аналитика (опционально)
│   │   └── profile.tsx          # ТАБ 5: Профиль
│   │
│   └── modals/
│
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── RoleSelectScreen.tsx
│   │   │   ├── VerificationScreen.tsx
│   │   │   └── ApprovalScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── dashboard/
│   │   ├── screens/
│   │   │   └── DashboardScreen.tsx
│   │   ├── components/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── OrdersPreview.tsx
│   │   │   ├── EarningsChart.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── orders/
│   │   ├── screens/
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   ├── OrderStatusScreen.tsx
│   │   │   └── OrderHistoryScreen.tsx
│   │   ├── components/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderActions.tsx
│   │   │   └── OrderTimeline.tsx
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── earnings/
│   │   ├── screens/
│   │   │   ├── EarningsScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   ├── WithdrawalScreen.tsx
│   │   │   └── AnalyticsScreen.tsx
│   │   ├── components/
│   │   │   ├── EarningsCard.tsx
│   │   │   ├── EarningsChart.tsx
│   │   │   ├── WithdrawalForm.tsx
│   │   │   └── TransactionItem.tsx
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── service-provider/         # Специфично для сервис-провайдеров
│   │   ├── screens/
│   │   │   ├── ScheduleScreen.tsx
│   │   │   ├── CertificatesScreen.tsx
│   │   │   └── SpecializationsScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── shop-owner/              # Специфично для владельцев магазинов
│   │   ├── screens/
│   │   │   ├── ProductsScreen.tsx
│   │   │   ├── ProductFormScreen.tsx
│   │   │   ├── CategoriesScreen.tsx
│   │   │   └── InventoryScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── restaurant-owner/        # Специфично для владельцев ресторанов
│   │   ├── screens/
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── DishFormScreen.tsx
│   │   │   ├── CookingTimeScreen.tsx
│   │   │   └── MenuCategoriesScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── taxi-driver/             # Специфично для таксистов
│   │   ├── screens/
│   │   │   ├── ActiveRideScreen.tsx
│   │   │   ├── MapNavigationScreen.tsx
│   │   │   ├── RideHistoryScreen.tsx
│   │   │   ├── VehicleScreen.tsx
│   │   │   └── DocumentsScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── hotel-owner/             # Специфично для владельцев гостиниц
│   │   ├── screens/
│   │   │   ├── RoomsScreen.tsx
│   │   │   ├── RoomFormScreen.tsx
│   │   │   ├── AvailabilityScreen.tsx
│   │   │   ├── BookingsCalendarScreen.tsx
│   │   │   └── OccupancyScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   ├── tour-guide/              # Специфично для гидов
│   │   ├── screens/
│   │   │   ├── ToursScreen.tsx
│   │   │   ├── TourFormScreen.tsx
│   │   │   ├── BookingsScreen.tsx
│   │   │   ├── ParticipantsScreen.tsx
│   │   │   └── LanguagesScreen.tsx
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   │
│   └── profile/
│       ├── screens/
│       │   ├── ProfileScreen.tsx
│       │   ├── EditProfileScreen.tsx
│       │   ├── DocumentsScreen.tsx
│       │   ├── BankDetailsScreen.tsx
│       │   └── SettingsScreen.tsx
│       ├── components/
│       ├── services/
│       ├── types/
│       └── hooks/
│
├── shared/                       # ОБЩИЕ РЕСУРСЫ
│   ├── components/ui/
│   ├── types/
│   ├── utils/
│   ├── services/
│   ├── hooks/
│   ├── contexts/
│   ├── assets/
│   └── styles/
│
├── app.json
├── package.json
├── tsconfig.json
└── ...
```

---

## 3. КЛЮЧЕВЫЕ ТИПЫ ДАННЫХ И ИНТЕРФЕЙСЫ

### 3.1 Сервис (Service Provider)

```typescript
interface ServiceProvider {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  image: string;
  availability: TimeSlot[];
  pricePerHour: number;
  description: string;
  certificates?: string[];
  // Контакты для связи
  whatsappPhone?: string;
  telegramUsername?: string;
  phoneNumber: string;
}

interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string;
  isAvailable: boolean;
}
```

### 3.2 Магазин и Товары

```typescript
interface Shop {
  id: string;
  name: string;
  category: 'food' | 'clothing' | 'electronics' | 'general';
  image: string;
  rating: number;
  reviewCount: number;
  address: Address;
  coordinates: { lat: number; lng: number };
  deliveryAvailable: boolean;
  deliveryTime: { min: number; max: number };
  minimumOrder: number;
  description: string;
}

interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
}
```

### 3.3 Заказ

```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shopId: string;
  totalAmount: number;
  discount?: number;
  shippingCost: number;
  deliveryAddress: Address;
  paymentMethod: 'card' | 'cash' | 'wallet';
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDeliveryTime: Date;
  deliveryTracking?: DeliveryTracking;
}
```

### 3.4 Такси

```typescript
interface TaxiRide {
  id: string;
  userId: string;
  driverId: string;
  pickupLocation: { lat: number; lng: number; address: string };
  dropoffLocation: { lat: number; lng: number; address: string };
  status: 'pending' | 'accepted' | 'driver_arrived' | 'in_transit' | 'completed' | 'cancelled';
  fare: number;
  carType: 'economy' | 'comfort' | 'premium';
  driverInfo: {
    name: string;
    image: string;
    rating: number;
    carDetails: string;
    licensePlate: string;
  };
  liveLocation?: { lat: number; lng: number };
}
```

---

## 4. API ENDPOINTS

### 4.1 Client App - Основные endpoint'ы

```
GET    /services                  # Все услуги
GET    /services/:categoryId      # Услуги по категориям
GET    /providers/:id             # Профиль провайдера
GET    /providers/:id/contacts    # Контакты (WhatsApp, Telegram, Phone)

GET    /shops                     # Все магазины
GET    /shops/:id/products        # Товары магазина
GET    /products                  # Поиск товаров

GET    /restaurants               # Все рестораны
GET    /restaurants/:id/menu      # Меню ресторана

POST   /orders                    # Создать заказ
GET    /orders                    # Мои заказы
GET    /orders/:id/track          # Отслеживание доставки

POST   /taxi/rides                # Заказать такси
GET    /taxi/rides/:id            # Детали поездки

GET    /hotels                    # Все гостиницы
POST   /hotel-bookings            # Забронировать номер

GET    /tours                     # Все туры
POST   /tour-bookings             # Забронировать тур

GET    /reviews/:targetId         # Отзывы об объекте
POST   /reviews                   # Оставить отзыв
```

### 4.2 Provider App - Основные endpoint'ы

```
GET    /provider/dashboard        # Dashboard статистика
GET    /provider/orders           # Входящие заказы
PUT    /provider/orders/:id/status # Изменить статус заказа

GET    /provider/earnings         # Статистика доходов
POST   /provider/withdrawals      # Запросить вывод средств

# Service Provider
PUT    /provider/availability     # Обновить расписание

# Shop Owner
GET    /provider/products         # Мои товары
POST   /provider/products         # Добавить товар
PUT    /provider/products/:id     # Обновить товар

# Restaurant Owner
GET    /provider/menu             # Мое меню
POST   /provider/menu             # Добавить блюдо

# Taxi Driver
PUT    /provider/status           # Статус онлайн/оффлайн
GET    /provider/active-ride      # Активная поездка

# Hotel Owner
GET    /provider/rooms            # Мои номера
PUT    /provider/rooms/:id/availability # Обновить доступность

# Tour Guide
GET    /provider/tours            # Мои туры
POST   /provider/tours            # Создать тур
```

---

## 5. ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Client & Provider App
- **Framework**: React Native / Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Navigation**: Expo Router (файловая система маршрутизации)
- **HTTP Client**: Axios
- **Real-time**: Socket.io
- **Maps**: Google Maps / Mapbox
- **Storage**: AsyncStorage
- **UI Library**: React Native Paper / Tamagui
- **Forms**: React Hook Form
- **Validation**: Zod / Yup
- **Payments**: Stripe SDK / PayPal SDK

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS / Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Socket.io / WebRTC
- **File Storage**: AWS S3 / Firebase Storage
- **Authentication**: JWT / OAuth 2.0
- **Payments**: Stripe API / PayPal API
- **Push Notifications**: Firebase Cloud Messaging
- **Search**: Elasticsearch
- **API Documentation**: Swagger/OpenAPI

---

## 6. ПРОЦЕСС РАЗРАБОТКИ

### Фаза 1: MVP (4-6 недель)
- Базовая аутентификация (обе приложения)
- Главная фича: Сервисы (сантехник, электрик, доктор)
- Контакты провайдеров (WhatsApp, Telegram, Phone)
- Профиль и настройки

### Фаза 2: Расширение (4-6 недель)
- Добавить фичи: Магазины, Рестораны
- Система заказов и отслеживания
- Provider App: Управление заказами

### Фаза 3: Полнота (4-6 недель)
- Такси, Гостиницы, Туры
- Система доходов и выводов средств
- Аналитика и статистика

### Фаза 4: Оптимизация (2-4 недели)
- Performance optimization
- Security audit
- A/B testing
- Bug fixes

---

## 7. СТРУКТУРА ПАПОК: SUMMARY

**Feature-Driven Architecture** означает:
- Каждая фича = отдельная папка
- В папке фичи: screens, components, services, types, hooks
- Фичи независимы друг от друга
- Shared папка для общих ресурсов
- Легко масштабировать и тестировать

**Преимущества:**
✅ Чистая структура кода
✅ Легко найти нужный файл
✅ Простое добавление новых фич
✅ Модульность и переиспользуемость
✅ Удобство в работе команды
✅ Простота в тестировании
