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

export interface CatalogListing {
  id: string;
  kind: "product" | "service";
  categoryId: string;
  subcategoryId: string;
  title: string;
  price: number;
  image: ImageProps["source"];
  seller: string;
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
