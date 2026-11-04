import { catalogCategories } from "@/features/services/api/catalog.data";
import { CategoryGrid } from "@/features/services/components/category-grid";
import { CategorySheet } from "@/features/services/components/category-sheet";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import { getCategoryPreview } from "@/features/services/utils/category-preview";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { type ReactElement, useState } from "react";
import { type FlatListProps, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

/** Заголовок открывает подкатегории в нижней панели; плитка ведёт сразу к предложениям. */
export function CatalogCategories({
  header,
  footer,
  onScroll,
  contentContainerStyle,
  stickyHeader = true,
}: {
  header: ReactElement;
  footer: ReactElement;
  onScroll?: FlatListProps<CatalogCategory>["onScroll"];
  contentContainerStyle?: FlatListProps<CatalogCategory>["contentContainerStyle"];
  stickyHeader?: boolean;
}) {
  const theme = useAppTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<CatalogCategory | null>(null);

  return (
    <>
      {/* Разделы виртуализированы; экран задаёт отступы и поведение верхней панели. */}
      <Animated.FlatList
        data={catalogCategories}
        keyExtractor={(category) => category.id}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        stickyHeaderIndices={stickyHeader ? [0] : undefined}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        windowSize={7}
        renderItem={({ item: category }) => (
          <View
            testID={`catalog-section-${category.id}`}
            style={{
              gap: theme.spacing.xxs,
              marginBottom: theme.spacing.lg,
              paddingHorizontal: theme.spacing.sm,
            }}
          >
            {/* Заголовок открывает полный список, даже если на главной видны лишь пять плиток. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Подкатегории: ${category.name}`}
              accessibilityHint="Открыть нижнюю панель"
              onPress={() => setSelectedCategory(category)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
                minHeight: 44,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                accessibilityRole="header"
                style={{
                  flexShrink: 1,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.title,
                  color: theme.colors.text.primary,
                }}
              >
                {category.name}
              </Text>
              <Ionicons
                name="arrow-forward-circle"
                size={theme.components.icon.sm}
                color={theme.colors.text.primary}
              />
            </Pressable>
            {/* Пять примеров представляют все группы объединённого раздела. */}
            <CategoryGrid
              items={getCategoryPreview(category)}
              onSelect={(subcategoryId) =>
                router.push({
                  pathname: "/category/[categoryId]/[subcategoryId]",
                  params: { categoryId: category.id, subcategoryId },
                })
              }
            />
          </View>
        )}
      />
      {/* Панель находится вне виртуализированных строк и сохраняет выбранный раздел. */}
      {selectedCategory && (
        <CategorySheet
          key={selectedCategory.id}
          category={selectedCategory}
          onDismiss={() => setSelectedCategory(null)}
          onOpenCategory={() =>
            router.push({
              pathname: "/category/[categoryId]",
              params: { categoryId: selectedCategory.id },
            })
          }
          onSelect={(subcategoryId) =>
            router.push({
              pathname: "/category/[categoryId]/[subcategoryId]",
              params: { categoryId: selectedCategory.id, subcategoryId },
            })
          }
        />
      )}
    </>
  );
}
