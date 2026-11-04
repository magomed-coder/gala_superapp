import { CategoryGrid } from "@/features/services/components/category-grid";
import type { CatalogCategory } from "@/features/services/types/catalog.types";
import GenericBottomSheet from "@/shared/components/generic-bottom-sheet";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CategorySheetProps = {
  category: CatalogCategory;
  onDismiss: () => void;
  onSelect: (subcategoryId: string) => void;
  onOpenCategory: () => void;
};

/** Показывает подкатегории поверх главной; выбор передаётся после закрытия панели. */
export function CategorySheet({
  category,
  onDismiss,
  onSelect,
  onOpenCategory,
}: CategorySheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const pendingSelection = useRef<
    { subcategoryId: string } | { category: true } | null
  >(null);

  /** Закрывает панель общей анимацией, в том числе по системной кнопке назад. */
  const close = () => sheetRef.current?.close();

  /** Убирает модальный слой перед переходом к выбранной подкатегории. */
  const handleClose = () => {
    const selectedId = pendingSelection.current;
    pendingSelection.current = null;
    onDismiss();
    if (selectedId && "subcategoryId" in selectedId)
      onSelect(selectedId.subcategoryId);
    else if (selectedId) onOpenCategory();
  };

  return (
    <Modal
      transparent
      visible
      onRequestClose={close}
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* Отдельный gesture-root нужен для свайпов внутри Android Modal. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GenericBottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={["92%"]}
          enableDynamicSizing={false}
          scrollable
          onClose={handleClose}
          backgroundStyle={{
            backgroundColor: theme.colors.background.primary,
            borderTopLeftRadius: theme.radius.xxl,
            borderTopRightRadius: theme.radius.xxl,
          }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.border.strong }}
          contentContainerStyle={{
            paddingBottom: theme.spacing.lg + insets.bottom,
          }}
        >
          <View
            testID="category-sheet"
            role="dialog"
            accessibilityLabel={category.name}
            accessibilityViewIsModal
            onAccessibilityEscape={close}
            style={{ gap: theme.spacing.md }}
          >
            {/* Крестик слева, как в референсе; область нажатия остаётся 44 × 44. */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Закрыть подкатегории"
                onPress={close}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? theme.opacity.pressed : 1,
                })}
              >
                <Ionicons
                  name="close"
                  size={theme.components.icon.xl}
                  color={theme.colors.text.primary}
                />
              </Pressable>
            </View>
            <CategoryGrid
              items={category.children}
              onSelect={(id) => {
                if (pendingSelection.current) return;
                pendingSelection.current = { subcategoryId: id };
                close();
              }}
            />
            {/* Весь раздел доступен отдельным действием после сетки подкатегорий. */}
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (pendingSelection.current) return;
                pendingSelection.current = { category: true };
                close();
              }}
              style={({ pressed }) => ({
                minHeight: 56,
                padding: theme.spacing.md,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colors.background.secondary,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.lg,
                  textAlign: "center",
                }}
              >
                {`Перейти в категорию «${category.name}»`}
              </Text>
            </Pressable>
          </View>
        </GenericBottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
}
