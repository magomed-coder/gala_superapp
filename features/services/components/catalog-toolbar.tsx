import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CatalogToolbarProps = {
  placeholder?: string;
  query?: string;
  onChangeQuery?: (query: string) => void;
  onSearch?: () => void;
  onFilters: () => void;
  filtersActive?: boolean;
  filtersExpanded?: boolean;
};

/** Компактная шапка выдачи; поиск либо открывает маршрут, либо редактирует переданный запрос. */
export function CatalogToolbar({
  placeholder = "Поиск в Грозном",
  query = "",
  onChangeQuery,
  onSearch,
  onFilters,
  filtersActive = false,
  filtersExpanded = false,
}: CatalogToolbarProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      testID="catalog-toolbar"
      style={{
        paddingTop: insets.top + theme.spacing.xs,
        paddingBottom: theme.spacing.sm,
        paddingLeft: Math.max(insets.left, theme.spacing.xxs),
        paddingRight: Math.max(insets.right, theme.spacing.md),
        backgroundColor: theme.colors.background.primary,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xxs,
      }}
    >
      {/* Возврат работает и после прямого открытия ссылки без истории. */}
      <IconButton
        icon={process.env.EXPO_OS === "ios" ? "chevron-back" : "arrow-back"}
        label="Назад"
        onPress={() =>
          router.canGoBack()
            ? router.back()
            : router.replace("/(tabs)/services")
        }
      />

      {/* Поле и фильтры объединены; служебные кнопки не сдвигают текст поиска. */}
      <View
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: theme.components.search.height,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: theme.radius.lg,
          borderCurve: "continuous",
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        {onChangeQuery ? (
          <View
            style={{
              flex: 1,
              minWidth: 0,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: theme.spacing.sm,
            }}
          >
            <Ionicons
              name="search-outline"
              size={theme.components.icon.sm}
              color={theme.colors.text.tertiary}
            />
            <TextInput
              accessibilityLabel="Что ищете"
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.tertiary}
              value={query}
              onChangeText={onChangeQuery}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: theme.components.search.height,
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: theme.spacing.xs,
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.lg,
              }}
            />
            <IconButton
              icon="close-circle"
              label="Очистить поиск"
              onPress={() => onChangeQuery("")}
              disabled={!query}
              color={theme.colors.text.tertiary}
              style={query ? undefined : { opacity: 0 }}
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={placeholder}
            onPress={onSearch}
            style={({ pressed }) => ({
              flex: 1,
              minWidth: 0,
              minHeight: theme.components.search.height,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Ionicons
              name="search-outline"
              size={theme.components.icon.sm}
              color={theme.colors.text.tertiary}
            />
            <Text
              style={{
                flex: 1,
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              {placeholder}
            </Text>
          </Pressable>
        )}
        <View>
          <IconButton
            icon="options-outline"
            label={filtersExpanded ? "Скрыть фильтры" : "Открыть фильтры"}
            selected={filtersExpanded}
            onPress={onFilters}
            color={
              filtersActive
                ? theme.colors.brand.primary
                : theme.colors.text.primary
            }
          />
          {/* Отметка активных фильтров накладывается поверх кнопки, не меняя её ширину. */}
          {filtersActive && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                right: theme.spacing.xs,
                top: theme.spacing.xs,
                width: theme.spacing.xs,
                height: theme.spacing.xs,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.brand.primary,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
