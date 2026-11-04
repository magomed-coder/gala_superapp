import { SearchBar } from "@/shared/components/search-bar";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;
const navbarGroups: { title: string; icons: IconName[] }[] = [
  {
    title: "Услуги",
    icons: [
      "grid-outline",
      "grid",
      "home-outline",
      "home",
      "compass-outline",
      "compass",
    ],
  },
  {
    title: "Избранное",
    icons: [
      "heart-outline",
      "heart",
      "bookmark-outline",
      "bookmark",
      "star-outline",
      "star",
    ],
  },
  {
    title: "Заказы",
    icons: [
      "clipboard-outline",
      "clipboard",
      "receipt-outline",
      "receipt",
      "list-outline",
      "list",
      "briefcase-outline",
      "briefcase",
    ],
  },
  {
    title: "Профиль",
    icons: [
      "person-outline",
      "person",
      "person-circle-outline",
      "person-circle",
      "id-card-outline",
      "id-card",
    ],
  },
];
const iconNames = navbarGroups.flatMap((group) => group.icons);
const iconGroups = new Map(
  navbarGroups.flatMap((group) =>
    group.icons.map((name) => [name, group.title] as const),
  ),
);

/** Временная подборка значков только для четырёх вкладок навбара. */
export function IconCatalog({ onClose }: { onClose: () => void }) {
  const theme = useAppTheme();
  const { width, fontScale } = useWindowDimensions();
  const columns = width < 360 || fontScale > 1.25 ? 2 : 3;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IconName>("clipboard-outline");
  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/);
    return iconNames.filter((name) =>
      words.every((word) =>
        `${name} ${iconGroups.get(name)}`.toLowerCase().includes(word),
      ),
    );
  }, [query]);
  const textStyle = {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      {/* Поиск и выбранное имя остаются на месте при прокрутке длинного каталога. */}
      <View style={{ padding: theme.spacing.sm, gap: theme.spacing.sm }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <Text
            style={{
              ...textStyle,
              flex: 1,
              fontSize: theme.typography.fontSize.title,
              fontFamily: theme.typography.fontFamily.bold,
            }}
          >
            Иконки навбара
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => ({
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: theme.spacing.xs,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Text style={textStyle}>К заказам</Text>
          </Pressable>
        </View>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Поиск иконок по названию"
          placeholder="Название иконки или вкладки"
          autoCapitalize="none"
        />
        <Text style={{ ...textStyle, color: theme.colors.text.secondary }}>
          {`${filtered.length} из ${iconNames.length} иконок. Нажмите на значок и сообщите его название.`}
        </Text>
        <View
          style={{
            minHeight: 56,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Ionicons
            name={selected}
            size={theme.components.icon.xl}
            color={theme.colors.text.primary}
          />
          <Text
            selectable
            accessibilityLiveRegion="polite"
            style={{ ...textStyle, flex: 1 }}
          >
            {selected}
          </Text>
        </View>
      </View>
      {/* Виртуализация сохраняет отзывчивость; постоянная рамка исключает сдвиг при выборе. */}
      <FlatList
        key={columns}
        data={filtered}
        extraData={selected}
        numColumns={columns}
        keyExtractor={(name) => name}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          padding: theme.spacing.sm,
          gap: theme.spacing.xs,
        }}
        columnWrapperStyle={{ gap: theme.spacing.xs }}
        initialNumToRender={24}
        windowSize={5}
        ListEmptyComponent={
          <Text style={textStyle}>
            Ничего не найдено. Попробуйте другое название.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item}
            accessibilityState={{ selected: selected === item }}
            onPress={() => setSelected(item)}
            style={({ pressed }) => ({
              width:
                (width -
                  theme.spacing.sm * 2 -
                  theme.spacing.xs * (columns - 1)) /
                columns,
              minHeight: 100,
              padding: theme.spacing.xs,
              gap: theme.spacing.xs,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor:
                selected === item ? theme.colors.text.primary : "transparent",
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.background.secondary,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Ionicons
              name={item}
              size={theme.components.icon.lg}
              color={theme.colors.text.primary}
            />
            <Text
              style={{
                ...textStyle,
                fontSize: theme.typography.fontSize.sm,
                textAlign: "center",
              }}
            >
              {item}
            </Text>
            <Text
              style={{
                ...textStyle,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              {iconGroups.get(item)}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
