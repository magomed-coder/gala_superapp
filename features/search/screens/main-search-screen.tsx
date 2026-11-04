import {
  catalogCategories,
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { CatalogCategoryStrip } from "@/features/services/components/catalog-category-strip";
import { CatalogEmptyState } from "@/features/services/components/catalog-empty-state";
import { CatalogFeed } from "@/features/services/components/catalog-feed";
import { CatalogResultsHeader } from "@/features/services/components/catalog-results-header";
import { CatalogToolbar } from "@/features/services/components/catalog-toolbar";
import type { CatalogFilters } from "@/features/services/types/catalog.types";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import { IconButton } from "@/shared/components/icon-button";
import { Button } from "@/shared/components/themed-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

const sortOptions = [
  { id: "recommended", name: "По рекомендации" },
  { id: "price-asc", name: "Сначала дешевле" },
  { id: "price-desc", name: "Сначала дороже" },
] as const;

/** Поиск владеет запросом и фильтрами; критерии раскрываются по кнопке над той же выдачей. */
export default function MainSearchScreen() {
  const params = useLocalSearchParams<{
    categoryId?: string;
    subcategoryId?: string;
    q?: string;
    filters?: string;
  }>();
  const theme = useAppTheme();
  const [query, setQuery] = useState(params.q ?? "");
  const [categoryId, setCategoryId] = useState(
    findCatalogCategory(params.categoryId)?.id ?? params.categoryId ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    params.subcategoryId ?? "",
  );
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<CatalogFilters["sort"]>("recommended");
  const [showFilters, setShowFilters] = useState(params.filters === "1");
  const category = findCatalogCategory(categoryId);
  const subcategory = category?.children.find(
    (child) => child.id === subcategoryId,
  );
  const hasPriceOrSort = Boolean(maxPrice) || sort !== "recommended";

  if ((categoryId && !category) || (subcategoryId && !subcategory)) {
    return <CatalogEmptyState title="Раздел поиска не найден" />;
  }

  const listings = filterCatalog(catalogListings, {
    query,
    categoryId,
    subcategoryId,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  });

  /** Убирает запрос и дополнительные ограничения, сохраняя выбранный раздел поиска. */
  const reset = () => {
    setQuery("");
    setMaxPrice("");
    setSort("recommended");
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <Stack.Screen
        options={{
          title: "Поиск",
          headerShown: false,
          statusBarStyle: theme.mode === "dark" ? "light" : "dark",
        }}
      />
      {/* Поиск закреплён; очистка и отметка фильтров имеют зарезервированное место. */}
      <CatalogToolbar
        placeholder="Что ищете?"
        query={query}
        onChangeQuery={setQuery}
        onFilters={() => {
          Keyboard.dismiss();
          setShowFilters((value) => !value);
        }}
        filtersActive={hasPriceOrSort}
        filtersExpanded={showFilters}
      />
      <CatalogFeed
        key={`${categoryId}:${subcategoryId}:${showFilters}`}
        listings={listings}
        onReset={reset}
        header={
          <View style={{ gap: theme.spacing.md }}>
            {/* Категории остаются сразу под поиском и не требуют открытия фильтров. */}
            <View style={{ marginHorizontal: -theme.spacing.md }}>
              <CatalogCategoryStrip
                items={[
                  { id: "", name: "Все категории" },
                  ...catalogCategories,
                ]}
                selectedId={categoryId}
                onSelect={(id) => {
                  setCategoryId(id);
                  setSubcategoryId("");
                }}
              />
            </View>

            {/* Подкатегорию из входящей ссылки можно снять, сохранив родительский раздел. */}
            {subcategory && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.md,
                  }}
                >
                  {subcategory.name}
                </Text>
                <IconButton
                  icon="close"
                  label="Искать во всём разделе"
                  onPress={() => setSubcategoryId("")}
                />
              </View>
            )}

            {/* Дополнительные критерии появляются только по запросу пользователя. */}
            {showFilters && (
              <View
                testID="catalog-filters"
                style={{
                  gap: theme.spacing.md,
                  paddingBottom: theme.spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.subtle,
                }}
              >
                <Text
                  accessibilityRole="header"
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.title,
                    fontFamily: theme.typography.fontFamily.bold,
                  }}
                >
                  Фильтры
                </Text>
                <Text
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.md,
                  }}
                >
                  Цена до, ₽
                </Text>
                <TextInput
                  accessibilityLabel="Максимальная цена в рублях"
                  placeholder="Без ограничений"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  value={maxPrice}
                  maxLength={12}
                  onChangeText={(value) =>
                    setMaxPrice(value.replace(/\D/g, ""))
                  }
                  style={{
                    minHeight: theme.components.input.height,
                    borderRadius: theme.radius.md,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.secondary,
                    fontSize: theme.typography.fontSize.lg,
                  }}
                />
                <View>
                  {sortOptions.map((option) => {
                    const selected = option.id === sort;

                    return (
                      <Pressable
                        key={option.id}
                        accessibilityRole="radio"
                        accessibilityLabel={option.name}
                        accessibilityState={{ checked: selected }}
                        onPress={() => setSort(option.id)}
                        style={({ pressed }) => ({
                          minHeight: theme.spacing.xxxl,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: theme.spacing.sm,
                          paddingVertical: theme.spacing.xs,
                          opacity: pressed ? theme.opacity.pressed : 1,
                        })}
                      >
                        {/* Обе иконки одинакового размера: выбор не сдвигает подпись. */}
                        <Ionicons
                          name={
                            selected ? "radio-button-on" : "radio-button-off"
                          }
                          size={theme.components.icon.md}
                          color={
                            selected
                              ? theme.colors.brand.primary
                              : theme.colors.text.tertiary
                          }
                        />
                        <Text
                          style={{
                            flex: 1,
                            color: theme.colors.text.primary,
                            fontSize: theme.typography.fontSize.lg,
                          }}
                        >
                          {option.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
                  <Button
                    label="Сбросить"
                    variant="outline"
                    onPress={reset}
                    disabled={!query && !hasPriceOrSort}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="Показать"
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowFilters(false);
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}
            <CatalogResultsHeader
              title={subcategory?.name ?? category?.name ?? "Все предложения"}
              count={listings.length}
            />
          </View>
        }
      />
    </View>
  );
}
