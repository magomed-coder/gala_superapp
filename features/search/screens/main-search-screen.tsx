import {
  catalogCategories,
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

/** Поиск по словам, категории и цене с локальной сортировкой демонстрационного каталога. */
export default function MainSearchScreen() {
  const params = useLocalSearchParams<{
    categoryId?: string;
    subcategoryId?: string;
    q?: string;
  }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [categoryId, setCategoryId] = useState(params.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = useState(
    params.subcategoryId ?? "",
  );
  const [maxPrice, setMaxPrice] = useState("");
  const [cheapestFirst, setCheapestFirst] = useState(false);
  const theme = useAppTheme();
  const category = findCatalogCategory(categoryId);

  if (
    (categoryId && !category) ||
    (subcategoryId &&
      !category?.children.some((child) => child.id === subcategoryId))
  )
    return <CatalogEmptyState title="Раздел поиска не найден" />;
  const listings = filterCatalog(catalogListings, {
    query,
    categoryId,
    subcategoryId,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: cheapestFirst ? "price-asc" : "recommended",
  });

  /** Сбрасывает все ограничения и снова показывает весь каталог. */
  const reset = () => {
    setQuery("");
    setCategoryId("");
    setSubcategoryId("");
    setMaxPrice("");
    setCheapestFirst(false);
  };

  return (
    <CatalogFeed
      listings={listings}
      onReset={reset}
      header={
        <View style={{ gap: theme.spacing.md }}>
          {/* Поле остаётся на том же месте при изменении количества результатов. */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md,
              minHeight: 52,
              borderRadius: theme.radius.xl,
              backgroundColor: theme.colors.background.secondary,
            }}
          >
            <Ionicons
              name="search-outline"
              size={theme.components.icon.md}
              color={theme.colors.text.tertiary}
            />
            <TextInput
              accessibilityLabel="Что ищете"
              placeholder="Что ищете?"
              placeholderTextColor={theme.colors.text.tertiary}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
              style={{
                flex: 1,
                minHeight: 52,
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.lg,
              }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Очистить поиск"
              disabled={!query}
              onPress={() => setQuery("")}
              style={({ pressed }) => ({
                width: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                opacity: !query
                  ? theme.opacity.disabled
                  : pressed
                    ? theme.opacity.pressed
                    : 1,
              })}
            >
              <Ionicons
                name="close-circle"
                size={theme.components.icon.sm}
                color={theme.colors.text.tertiary}
              />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: theme.spacing.xs }}
          >
            {[{ id: "", name: "Все категории" }, ...catalogCategories].map(
              (item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.id === categoryId }}
                  onPress={() => {
                    setCategoryId(item.id);
                    setSubcategoryId("");
                  }}
                  style={({ pressed }) => ({
                    minHeight: 44,
                    justifyContent: "center",
                    paddingHorizontal: theme.spacing.md,
                    borderRadius: theme.radius.full,
                    backgroundColor:
                      item.id === categoryId
                        ? theme.colors.brand.primary
                        : theme.colors.background.secondary,
                    opacity: pressed ? theme.opacity.pressed : 1,
                  })}
                >
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.md,
                      color:
                        item.id === categoryId
                          ? theme.colors.brand.onPrimary
                          : theme.colors.text.primary,
                    }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              ),
            )}
          </ScrollView>
          {Boolean(subcategoryId) && (
            <Text
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.md,
              }}
            >
              Подкатегория:{" "}
              {
                category?.children.find((child) => child.id === subcategoryId)
                  ?.name
              }
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.xs,
            }}
          >
            <TextInput
              accessibilityLabel="Максимальная цена в рублях"
              placeholder="Цена до, ₽"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="number-pad"
              value={maxPrice}
              onChangeText={(value) => setMaxPrice(value.replace(/\D/g, ""))}
              style={{
                flex: 1,
                minWidth: 120,
                minHeight: 48,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.lg,
              }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: cheapestFirst }}
              onPress={() => setCheapestFirst(!cheapestFirst)}
              style={({ pressed }) => ({
                minHeight: 48,
                justifyContent: "center",
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.background.secondary,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.md,
                }}
              >
                {cheapestFirst ? "Сначала дешевле ↑" : "По рекомендации"}
              </Text>
            </Pressable>
          </View>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              fontFamily: theme.typography.fontFamily.bold,
              fontSize: theme.typography.fontSize.titleSm,
              color: theme.colors.text.primary,
            }}
          >
            Найдено: {listings.length}
          </Text>
        </View>
      }
    />
  );
}
