import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { CatalogSearchLink } from "@/features/services/components/catalog-search-link";
import { CategoryGrid } from "@/features/services/components/category-grid";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { useAppTheme } from "@/shared/theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

/** Страница категории объединяет её подкатегории, поиск по области и предложения. */
export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = findCatalogCategory(categoryId);
  const theme = useAppTheme();
  const router = useRouter();

  if (!category) return <CatalogEmptyState title="Категория не найдена" />;
  const listings = filterCatalog(catalogListings, { categoryId: category.id });

  return (
    <>
      <Stack.Screen options={{ title: category.name }} />
      <CatalogFeed
        listings={listings}
        header={
          <View style={{ gap: theme.spacing.lg }}>
            <CategoryGrid
              items={category.children}
              onSelect={(subcategoryId) =>
                router.push({
                  pathname: "/category/[categoryId]/[subcategoryId]",
                  params: { categoryId: category.id, subcategoryId },
                })
              }
            />
            {/* Поиск сохраняет контекст категории и ведёт к реальным фильтрам списка. */}
            <View
              style={{
                padding: theme.spacing.md,
                borderRadius: theme.radius.xxl,
                backgroundColor: theme.colors.brand.light,
                gap: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.title,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Найдите подходящее предложение
              </Text>
              <Text
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.md,
                }}
              >
                {category.description}
              </Text>
              <CatalogSearchLink categoryId={category.id} />
            </View>
            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.title,
                fontFamily: theme.typography.fontFamily.bold,
              }}
            >
              Все предложения · {listings.length}
            </Text>
          </View>
        }
      />
    </>
  );
}
