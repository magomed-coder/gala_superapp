import { catalogCategories } from "@/features/services/api/catalog.data";
import { CategoryGrid } from "@/features/services/components/category-grid";
import { CategorySheet } from "@/features/services/components/category-sheet";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

/** Заголовок открывает подкатегории в нижней панели; плитка ведёт сразу к предложениям. */
export function CatalogCategories() {
  const theme = useAppTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<CatalogCategory | null>(null);

  return (
    <View style={{ gap: theme.spacing.lg }}>
      {catalogCategories.map((category) => (
        <View key={category.id} style={{ gap: theme.spacing.xxs }}>
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
          <CategoryGrid
            items={category.children}
            onSelect={(subcategoryId) =>
              router.push({
                pathname: "/category/[categoryId]/[subcategoryId]",
                params: { categoryId: category.id, subcategoryId },
              })
            }
          />
        </View>
      ))}
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
    </View>
  );
}
