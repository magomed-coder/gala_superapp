import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, type ImageProps } from "expo-image";
import { FlatList, Pressable, Text, View } from "react-native";

type CategoryOption = {
  id: string;
  name: string;
  image?: ImageProps["source"];
  audience?: string;
};

/** Горизонтальные категории под поиском; выбранная плитка сохраняет постоянную рамку и размер. */
export function CatalogCategoryStrip({
  items,
  selectedId,
  onSelect,
}: {
  items: CategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const theme = useAppTheme();
  const itemWidth = theme.spacing.xxxl * 2 + theme.spacing.xs;
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  );

  return (
    <FlatList
      horizontal
      data={items}
      extraData={selectedId}
      initialScrollIndex={Math.max(0, selectedIndex - 1)}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.xs,
        paddingBottom: theme.spacing.sm,
      }}
      renderItem={({ item }) => {
        const selected = item.id === selectedId;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Категория: ${item.name}${item.audience ? `, ${item.audience}` : ""}`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => ({
              width: theme.spacing.xxxl * 2,
              alignItems: "center",
              gap: theme.spacing.xs,
              padding: theme.spacing.xs,
              borderWidth: 1,
              borderColor: selected
                ? theme.colors.brand.primary
                : "transparent",
              borderRadius: theme.radius.lg,
              borderCurve: "continuous",
              backgroundColor: selected
                ? theme.colors.brand.light
                : theme.colors.background.secondary,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            {/* Область изображения одинакова у всех категорий и не зависит от его загрузки. */}
            <View
              style={{
                width: theme.spacing.xxxl,
                height: theme.spacing.xxxl,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.image ? (
                <Image
                  source={item.image}
                  contentFit="contain"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Ionicons
                  name="grid-outline"
                  size={theme.components.icon.md}
                  color={theme.colors.text.primary}
                />
              )}
            </View>
            <Text
              style={{
                color: theme.colors.text.primary,
                textAlign: "center",
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.sm,
                fontFamily: theme.typography.fontFamily.regular,
              }}
            >
              {item.name}
            </Text>
            {/* Аудитория различает одинаковые названия мужских и женских услуг. */}
            {item.audience && (
              <Text
                style={{
                  color: theme.colors.text.secondary,
                  textAlign: "center",
                  fontSize: theme.typography.fontSize.sm,
                  lineHeight: theme.typography.lineHeight.sm,
                }}
              >
                {item.audience}
              </Text>
            )}
          </Pressable>
        );
      }}
    />
  );
}
