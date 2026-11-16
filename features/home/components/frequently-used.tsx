import { catalogCategories } from "@/features/services/api/catalog.data";
import { useAppTheme } from "@/shared/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

// Случайно выбранная стартовая подборка фиксирована до подключения статистики использования.
const starterIds = [
  "tuning",
  "umrah",
  "tables-chairs",
  "playrooms",
  "accounting",
];
const starterItems = starterIds.flatMap((id) =>
  catalogCategories.flatMap((category) =>
    category.children.filter((item) => item.id === id),
  ),
);

/** Показывает быстрые переходы только изображениями; названия доступны экранному диктору. */
export function FrequentlyUsed() {
  const theme = useAppTheme();
  const router = useRouter();
  // Локальный размер плашки 70×70 pt задан для этой ленты.
  const itemWidth = 70;

  if (starterItems.length === 0) return null;

  /** Открывает выбранную подкатегорию с ID её текущего объединённого раздела. */
  function openSubcategory(subcategoryId: string) {
    const category = catalogCategories.find((item) =>
      item.children.some((child) => child.id === subcategoryId),
    );

    if (!category) return;

    router.push({
      pathname: "/category/[categoryId]/[subcategoryId]",
      params: { categoryId: category.id, subcategoryId },
    });
  }

  return (
    <View
      testID="home-frequently-used"
      style={{
        paddingTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
      }}
    >
      {/* Один ряд прокручивается нативным свайпом; боковые отступы совпадают с разделами. */}
      <ScrollView
        horizontal
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          alignItems: "stretch",
        }}
      >
        {starterItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={
              item.audience ? `${item.name}, ${item.audience}` : item.name
            }
            onPress={() => openSubcategory(item.id)}
            style={({ pressed }) => ({
              width: itemWidth,
              alignItems: "center",
              borderRadius: theme.radius.md,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            {/* Иллюстрация занимает всю ширину пункта: между плашками ровно 8 pt, загрузка не меняет размеры. */}
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: theme.radius.lg,
                borderCurve: "continuous",
                backgroundColor: theme.colors.background.secondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={item.image}
                contentFit="contain"
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{
                  width: theme.components.avatar.lg,
                  height: theme.components.avatar.lg,
                }}
              />
            </View>

          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
