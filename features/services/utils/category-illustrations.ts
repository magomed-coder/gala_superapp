import sources from "@/assets/imgs/catalog/category-sources.json";
import type { ImageSource } from "expo-image";

// Явные require позволяют Metro включить локальные PNG в сборку без сетевой загрузки.
const images: Record<string, ImageSource> = {
  "food-groceries": require("@/assets/imgs/catalog/food-groceries.webp"),
  "home-repair": require("@/assets/imgs/catalog/home-repair.webp"),
  "cleaning-household": require("@/assets/imgs/catalog/cleaning-household.webp"),
  "furniture-interior": require("@/assets/imgs/catalog/furniture-interior.webp"),
  electronics: require("@/assets/imgs/catalog/electronics.webp"),
  auto: require("@/assets/imgs/catalog/auto.webp"),
  "beauty-care": require("@/assets/imgs/catalog/beauty-care.webp"),
  health: require("@/assets/imgs/catalog/health.webp"),
  "children-family": require("@/assets/imgs/catalog/children-family.webp"),
  education: require("@/assets/imgs/catalog/education.webp"),
  sports: require("@/assets/imgs/catalog/sports.webp"),
  "clothing-tailoring": require("@/assets/imgs/catalog/clothing-tailoring.webp"),
  "weddings-events": require("@/assets/imgs/catalog/weddings-events.webp"),
  "flowers-gifts": require("@/assets/imgs/catalog/flowers-gifts.webp"),
  "travel-leisure": require("@/assets/imgs/catalog/travel-leisure.webp"),
  "real-estate": require("@/assets/imgs/catalog/real-estate.webp"),
  "business-services": require("@/assets/imgs/catalog/business-services.webp"),
  "delivery-moving": require("@/assets/imgs/catalog/delivery-moving.webp"),
  "garden-farming": require("@/assets/imgs/catalog/garden-farming.webp"),
  "religion-community": require("@/assets/imgs/catalog/religion-community.webp"),
};

export const categoryIllustrations = sources.images.map((item) => ({
  id: item.categoryId,
  name: item.categoryName,
  image: images[item.categoryId],
}));

export type CategoryIllustration = (typeof categoryIllustrations)[number];
