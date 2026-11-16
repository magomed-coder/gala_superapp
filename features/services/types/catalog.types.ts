import type { ImageProps } from "expo-image";

export interface CatalogSubcategory {
  id: string;
  name: string;
  image: ImageProps["source"];
  audience?: string;
}

export interface CatalogCategory extends CatalogSubcategory {
  description: string;
  children: CatalogSubcategory[];
  groups: CatalogCategoryGroup[];
}

export interface CatalogCategoryGroup {
  id: string;
  name: string;
  children: CatalogSubcategory[];
}

/** Способ заказа выбирается поставщиком для конкретного товара или услуги. */
export type ListingPurchaseMode = "purchase" | "negotiation" | "both";

export interface ListingDraft {
  title: string;
  kind: "product" | "service";
  description: string;
  priceText: string;
  purchaseMode: ListingPurchaseMode | null;
}

export interface CatalogListing {
  id: string;
  kind: "product" | "service";
  categoryId: string;
  subcategoryId: string;
  title: string;
  price: number;
  purchaseMode: ListingPurchaseMode;
  image: ImageProps["source"];
  sellerId: string;
  seller: string;
  location: string;
  description: string;
}

export interface CatalogSeller {
  id: string;
  name: string;
  kind: "store" | "specialist" | "team";
  location: string;
  description: string;
}

export interface CatalogFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  maxPrice?: number;
  sort?: "recommended" | "price-asc" | "price-desc";
}
