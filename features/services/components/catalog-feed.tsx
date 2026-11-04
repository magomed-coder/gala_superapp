import { ListingCard } from "@/features/services/components/listing-card";
import type { CatalogListing } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import type { ReactElement } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Виртуализированная лента; поиск и категории передаются её заголовком, без вложенной вертикальной прокрутки. */
export function CatalogFeed({
  listings,
  header,
  emptyTitle = "Ничего не найдено",
  emptyDescription = "Попробуйте другой запрос или измените фильтры.",
  onReset,
}: {
  listings: CatalogListing[];
  header?: ReactElement;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}) {
  const theme = useAppTheme();
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const columns = fontScale > 1.5 ? 1 : 2;

  return (
    <FlatList
      key={columns}
      data={listings}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.lg + insets.bottom,
        gap: theme.spacing.lg,
        flexGrow: 1,
      }}
      columnWrapperStyle={columns === 2 ? { gap: theme.spacing.sm } : undefined}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <View style={{ flex: 1, maxWidth: columns === 2 ? "48.5%" : "100%" }}>
          <ListingCard listing={item} />
        </View>
      )}
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            paddingVertical: theme.spacing.xxl,
            gap: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.titleSm,
              fontFamily: theme.typography.fontFamily.bold,
            }}
          >
            {emptyTitle}
          </Text>
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.lg,
              textAlign: "center",
            }}
          >
            {emptyDescription}
          </Text>
          {onReset && (
            <Pressable
              accessibilityRole="button"
              onPress={onReset}
              style={({ pressed }) => ({
                minHeight: 48,
                padding: theme.spacing.sm,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                style={{
                  color: theme.colors.text.link,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                Сбросить фильтры
              </Text>
            </Pressable>
          )}
        </View>
      }
    />
  );
}
