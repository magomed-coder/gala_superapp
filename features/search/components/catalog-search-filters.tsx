import type { CatalogFilters } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

// В браузере нет native focus API, который вызывает BottomSheetTextInput при потере фокуса.
const PriceInput =
  process.env.EXPO_OS === "web" ? TextInput : BottomSheetTextInput;

const sortOptions = [
  { id: "recommended", name: "По рекомендации" },
  { id: "price-asc", name: "Сначала дешевле" },
  { id: "price-desc", name: "Сначала дороже" },
] as const;

type CatalogSearchFiltersProps = {
  maxPrice: string;
  onChangeMaxPrice: (value: string) => void;
  sort: NonNullable<CatalogFilters["sort"]>;
  onChangeSort: (value: NonNullable<CatalogFilters["sort"]>) => void;
};

/** Редактирует цену и сортировку черновика внутри панели; поле согласовано с её клавиатурой. */
export function CatalogSearchFilters({
  maxPrice,
  onChangeMaxPrice,
  sort,
  onChangeSort,
}: CatalogSearchFiltersProps) {
  const theme = useAppTheme();

  return (
    <View
      testID="catalog-filters"
      style={{
        gap: theme.spacing.md,
      }}
    >
      {/* Цена меняется только в черновике до нажатия «Показать», поле принимает цифры. */}
      <Text
        style={{
          color: theme.colors.text.secondary,
          fontSize: theme.typography.fontSize.md,
        }}
      >
        Цена до, ₽
      </Text>
      <PriceInput
        accessibilityLabel="Максимальная цена в рублях"
        placeholder="Без ограничений"
        placeholderTextColor={theme.colors.text.tertiary}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        value={maxPrice}
        maxLength={12}
        onChangeText={(value) => onChangeMaxPrice(value.replace(/\D/g, ""))}
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
      {/* Сортировка меняет порядок предложений, сохраняя остальные критерии. */}
      <View>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
            marginBottom: theme.spacing.xs,
          }}
        >
          Сортировка
        </Text>
        {sortOptions.map((option) => {
          const selected = option.id === sort;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityLabel={option.name}
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              onPress={() => onChangeSort(option.id)}
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
                name={selected ? "radio-button-on" : "radio-button-off"}
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
    </View>
  );
}
