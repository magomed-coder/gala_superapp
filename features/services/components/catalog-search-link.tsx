import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

/** Открывает поиск в текущей категории или во всём каталоге. */
export function CatalogSearchLink({ categoryId }: { categoryId?: string }) {
  const theme = useAppTheme();
  const router = useRouter();
  const openSearch = () =>
    router.push({
      pathname: "/search",
      params: categoryId ? { categoryId } : {},
    });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.background.secondary,
      }}
    >
      <Pressable
        accessibilityRole="search"
        accessibilityLabel="Поиск в Грозном"
        onPress={openSearch}
        style={({ pressed }) => ({
          flex: 1,
          minHeight: theme.components.search.height,
          padding: theme.spacing.sm,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Ionicons
          name="search-outline"
          size={theme.components.icon.md}
          color={theme.colors.text.tertiary}
        />
        <Text
          style={{
            flex: 1,
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          Поиск в Грозном
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Фильтры поиска"
        onPress={openSearch}
        style={({ pressed }) => ({
          minWidth: theme.components.search.height,
          minHeight: theme.components.search.height,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Ionicons
          name="options-outline"
          size={theme.components.icon.md}
          color={theme.colors.text.primary}
        />
      </Pressable>
    </View>
  );
}
