import { catalogCategories } from "@/features/services/api/catalog.data";

// Галерея повторяет действующие разделы, а не архивную структуру источников картинок.
export const categoryIllustrations = catalogCategories.map((category) => ({
  id: category.id,
  name: category.name,
  image: category.image,
}));

export type CategoryIllustration = (typeof categoryIllustrations)[number];
