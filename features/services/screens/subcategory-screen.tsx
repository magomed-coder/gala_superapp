import {
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { useAppTheme } from "@/shared/theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

/** Выдача подкатегории с переключением соседних разделов без потери родительской категории. */
export default function SubcategoryScreen() {
  const { categoryId, subcategoryId } = useLocalSearchParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const category = findCatalogCategory(categoryId);
  const subcategory = category?.children.find(
    (child) => child.id === subcategoryId,
  );
  const theme = useAppTheme();
  const router = useRouter();

  if (!category || !subcategory)
    return <CatalogEmptyState title="Подкатегория не найдена" />;
  const listings = filterCatalog(catalogListings, {
    categoryId,
    subcategoryId,
  });

  return (
    <>
      <Stack.Screen options={{ title: subcategory.name }} />
      <CatalogFeed
        listings={listings}
        header={
          <View style={{ gap: theme.spacing.md }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: theme.spacing.xs }}
            >
              {category.children.map((child) => {
                const selected = child.id === subcategoryId;
                return (
                  <Pressable
                    key={child.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() =>
                      router.setParams({ subcategoryId: child.id })
                    }
                    style={({ pressed }) => ({
                      minHeight: 44,
                      justifyContent: "center",
                      paddingHorizontal: theme.spacing.md,
                      borderRadius: theme.radius.full,
                      backgroundColor: selected
                        ? theme.colors.brand.primary
                        : theme.colors.background.secondary,
                      opacity: pressed ? theme.opacity.pressed : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: selected
                          ? theme.colors.brand.onPrimary
                          : theme.colors.text.primary,
                        fontSize: theme.typography.fontSize.md,
                      }}
                    >
                      {child.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { categoryId, subcategoryId },
                })
              }
              style={({ pressed }) => ({
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                backgroundColor: theme.colors.background.secondary,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                Поиск и фильтры · Найдено: {listings.length}
              </Text>
            </Pressable>
          </View>
        }
      />
    </>
  );
}
