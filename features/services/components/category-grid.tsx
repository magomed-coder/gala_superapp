import type { CatalogSubcategory } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { Image } from "expo-image";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

/** Плитка категории: подпись сверху, иллюстрация в зарезервированной нижней области. */
export function CategoryTile({
  item,
  onPress,
  compact = false,
}: {
  item: CatalogSubcategory;
  onPress: () => void;
  compact?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: compact ? 88 : 96,
        padding: theme.spacing.xs,
        paddingBottom: theme.spacing.xxxl,
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: theme.colors.background.secondary,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      <Text
        style={{
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        }}
      >
        {item.name}
      </Text>
      {/* Нижние 48 pt зарезервированы под иллюстрацию; длинная подпись увеличивает плитку. */}
      <Image
        source={item.image}
        contentFit="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{
          position: "absolute",
          right: -4,
          bottom: -4,
          width: "76%",
          height: 56,
        }}
      />
    </Pressable>
  );
}

/** Сетка 3 + 2 как в каталоге-референсе; крупный системный текст переключает её в две колонки. */
export function CategoryGrid({
  items,
  onSelect,
}: {
  items: CatalogSubcategory[];
  onSelect: (id: string) => void;
}) {
  const theme = useAppTheme();
  const { width, fontScale } = useWindowDimensions();
  const firstRowSize = width < 360 || fontScale > 1.25 ? 2 : 3;
  const rows: CatalogSubcategory[][] = [];
  for (let index = 0; index < items.length; index += firstRowSize)
    rows.push(items.slice(index, index + firstRowSize));

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {rows.map((row) => (
        <View
          key={row[0].id}
          style={{ flexDirection: "row", gap: theme.spacing.xs }}
        >
          {row.map((item) => (
            <CategoryTile
              key={item.id}
              item={item}
              onPress={() => onSelect(item.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
