import type { CatalogFilters } from "@/features/services/types/catalog.types";

/** Параметры поиска для прямой ссылки и сохранения критериев при смене маршрута раздела. */
export type CatalogSearchParams = {
  q?: string;
  maxPrice?: string;
  sort?: string;
  filters?: string;
};

/** Применённый выбор панели; её локальный черновик имеет тот же контракт. Запрос редактируется отдельно в шапке. */
export type CatalogSearchSelection = {
  categoryId: string;
  subcategoryId: string;
  maxPrice: string;
  sort: NonNullable<CatalogFilters["sort"]>;
};
