import { ListingCard } from "@/features/services/components/listing-card";
import type { CatalogListing } from "@/features/services/types/catalog.types";
import { useAppTheme } from "@/shared/theme";
import { type ReactElement, useEffect, useRef } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Виртуализированная лента; emptyContent заменяет заглушку, scrollResetKey возвращает к началу без потери фокуса полей. */
export function CatalogFeed({
  listings,
  header,
  emptyContent,
  emptyTitle = "Ничего не найдено",
  emptyDescription = "Попробуйте другой запрос или измените фильтры.",
  onReset,
  scrollResetKey,
}: {
  listings: CatalogListing[];
  header?: ReactElement;
  emptyContent?: ReactElement;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
  scrollResetKey?: string;
}) {
  const theme = useAppTheme();
  const { fontScale, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<CatalogListing>>(null);
  const columns = fontScale > 1.5 || width < 320 ? 1 : 2;
  const cardWidth =
    (width -
      theme.spacing.md * 2 -
      insets.left -
      insets.right -
      (columns - 1) * theme.spacing.sm) /
    columns;

  // Смена области или критериев возвращает к результатам, сохраняя экземпляр списка и поля в его шапке.
  useEffect(() => {
    if (scrollResetKey !== undefined) {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [scrollResetKey]);

  return (
    <FlatList
      ref={listRef}
      testID="catalog-feed"
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
        paddingTop: theme.spacing.xxs,
        paddingLeft: theme.spacing.md + insets.left,
        paddingRight: theme.spacing.md + insets.right,
        paddingBottom: theme.spacing.lg + insets.bottom,
        gap: theme.spacing.lg,
        flexGrow: 1,
      }}
      columnWrapperStyle={columns === 2 ? { gap: theme.spacing.sm } : undefined}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <ListingCard listing={item} />
        </View>
      )}
      ListEmptyComponent={
        emptyContent ?? (
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
        )
      }
    />
  );
}
