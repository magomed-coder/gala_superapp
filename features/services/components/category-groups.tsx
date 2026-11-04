import { CategoryGrid } from "@/features/services/components/category-grid";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { Text, View } from "react-native";

/** Показывает группы подкатегорий в панели и на странице раздела; выбор передаёт родителю. */
export function CategoryGroups({
  category,
  onSelect,
}: {
  category: CatalogCategory;
  onSelect: (subcategoryId: string) => void;
}) {
  const theme = useAppTheme();
  const showHeadings = category.groups.length > 1;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      {/* Заголовки разделяют объединённые темы; единственная группа не дублирует название экрана. */}
      {category.groups.map((group) => (
        <View key={group.id} style={{ gap: theme.spacing.sm }}>
          {showHeadings && (
            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
                fontSize: theme.typography.fontSize.titleSm,
                lineHeight: theme.typography.lineHeight.titleSm,
              }}
            >
              {group.name}
            </Text>
          )}
          {/* Плитки сохраняют область изображения и растут при увеличении системного текста. */}
          <CategoryGrid items={group.children} onSelect={onSelect} />
        </View>
      ))}
    </View>
  );
}
