import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Pressable, Text, View } from "react-native";

type ScopeOption = { id: string; name: string; audience?: string };

/** Виртуализированный выбор раздела внутри панели; отметка всегда занимает одинаковое место. */
export function CatalogScopePicker({
  items,
  selectedId,
  onSelect,
}: {
  items: ScopeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const theme = useAppTheme();

  return (
    <BottomSheetFlatList
      enableFooterMarginAdjustment
      testID="catalog-scope-options"
      data={items}
      extraData={selectedId}
      keyExtractor={(item: ScopeOption) => item.id}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: theme.spacing.md }}
      renderItem={({ item }: { item: ScopeOption }) => {
        const selected = item.id === selectedId;
        const label = item.audience
          ? `${item.name}, ${item.audience}`
          : item.name;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: selected }}
            aria-checked={selected}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => ({
              minHeight: theme.components.input.height,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.xs,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border.subtle,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            {/* Подписи не обрезаются и растут вместе с системным размером текста. */}
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                {item.name}
              </Text>
              {item.audience && (
                <Text
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.md,
                  }}
                >
                  {item.audience}
                </Text>
              )}
            </View>
            {/* Прозрачная отметка сохраняет ширину строки при смене выбора. */}
            <Ionicons
              name="checkmark"
              size={theme.components.icon.md}
              color={theme.colors.brand.primary}
              style={{ opacity: selected ? 1 : 0 }}
            />
          </Pressable>
        );
      }}
    />
  );
}
