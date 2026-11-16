import { CatalogScopePicker } from "@/features/search/components/catalog-scope-picker";
import { CatalogSearchFilters } from "@/features/search/components/catalog-search-filters";
import type { CatalogSearchSelection } from "@/features/search/types/catalog-search-params";
import {
  catalogCategories,
  catalogListings,
  findCatalogCategory,
} from "@/features/services/api/catalog.data";
import { filterCatalog } from "@/features/services/utils/filter-catalog";
import GenericBottomSheet from "@/shared/components/generic-bottom-sheet";
import { IconButton } from "@/shared/components/icon-button";
import { Button } from "@/shared/components/themed-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetFooter,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Keyboard, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Поле выбора открывает список в той же панели; значение переносится при крупном шрифте. */
function ScopeField({
  label,
  value,
  disabled = false,
  onPress,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.components.input.height,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
        opacity: disabled
          ? theme.opacity.disabled
          : pressed
            ? theme.opacity.pressed
            : 1,
      })}
    >
      {/* Две строки отделяют назначение поля от выбранного раздела. */}
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          {value}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={theme.components.icon.sm}
        color={theme.colors.text.tertiary}
      />
    </Pressable>
  );
}

/** Редактирует локальный черновик области, цены и сортировки; применение передаётся после закрытия модального слоя. */
export function CatalogFilterSheet({
  selection,
  query,
  onDismiss,
  onApply,
}: {
  selection: CatalogSearchSelection;
  query: string;
  onDismiss: () => void;
  onApply: (selection: CatalogSearchSelection) => void;
}) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const pendingSelection = useRef<CatalogSearchSelection | null>(null);
  const [draft, setDraft] = useState(selection);
  const [step, setStep] = useState<"filters" | "category" | "subcategory">(
    "filters",
  );
  const category = findCatalogCategory(draft.categoryId);
  const subcategory = category?.children.find(
    (child) => child.id === draft.subcategoryId,
  );
  const count = filterCatalog(catalogListings, {
    query,
    categoryId: draft.categoryId,
    subcategoryId: draft.subcategoryId,
    maxPrice: draft.maxPrice ? Number(draft.maxPrice) : undefined,
    sort: draft.sort,
  }).length;
  const canReset = Boolean(
    draft.categoryId ||
      draft.subcategoryId ||
      draft.maxPrice ||
      draft.sort !== "recommended",
  );
  const title =
    step === "category"
      ? "Категория"
      : step === "subcategory"
        ? "Подкатегория"
        : "Фильтры";

  /** Закрывает панель жестом библиотеки; без ожидающего применения черновик будет отброшен. */
  const close = useCallback(() => {
    Keyboard.dismiss();
    sheetRef.current?.close();
  }, []);

  /** Сначала снимает модальный слой, затем применяет выбор и разрешает переход между маршрутами. */
  const handleClose = () => {
    const next = pendingSelection.current;
    pendingSelection.current = null;
    onDismiss();
    if (next) onApply(next);
  };

  /** Системный возврат из списка ведёт к фильтрам; из основных фильтров закрывает всю панель. */
  const goBack = useCallback(() => {
    if (step === "filters") close();
    else setStep("filters");
  }, [close, step]);

  /** Закрепляет действия над клавиатурой средствами панели; высота учитывается scrollable-компонентами. */
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        {/* Счётчик отделён от кнопок: изменение числа результатов не меняет их ширину или положение. */}
        <View
          style={{
            gap: theme.spacing.xs,
            paddingTop: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            paddingBottom: insets.bottom + theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.subtle,
            backgroundColor: theme.colors.background.primary,
          }}
        >
          <Text
            accessibilityLiveRegion="polite"
            style={{
              textAlign: "center",
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.md,
              lineHeight: theme.typography.lineHeight.md,
              fontVariant: ["tabular-nums"],
            }}
          >
            {`Найдено предложений: ${count.toLocaleString("ru-RU")}`}
          </Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
            <Button
              label="Сбросить"
              variant="outline"
              disabled={!canReset}
              onPress={() => {
                Keyboard.dismiss();
                setDraft({
                  categoryId: "",
                  subcategoryId: "",
                  maxPrice: "",
                  sort: "recommended",
                });
                setStep("filters");
              }}
              style={{ flex: 1 }}
            />
            <Button
              label="Показать"
              onPress={() => {
                if (pendingSelection.current) return;
                pendingSelection.current = draft;
                close();
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [canReset, close, count, draft, insets.bottom, theme],
  );

  // Панель живёт в текущем экране: системный возврат и Escape сначала обрабатывают её локальные шаги.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goBack();
        return true;
      },
    );
    if (process.env.EXPO_OS !== "web") {
      return () => subscription.remove();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      subscription.remove();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goBack]);

  return (
    <View
      testID="catalog-filter-sheet"
      role="dialog"
      accessibilityLabel="Фильтры каталога"
      accessibilityViewIsModal
      onAccessibilityEscape={goBack}
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <GenericBottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={["92%"]}
        enableDynamicSizing={false}
        fillContent
        footerComponent={renderFooter}
        topInset={insets.top}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableBlurKeyboardOnGesture
        android_keyboardInputMode="adjustResize"
        onClose={handleClose}
        backgroundStyle={{
          backgroundColor: theme.colors.background.primary,
          borderTopLeftRadius: theme.radius.xxl,
          borderTopRightRadius: theme.radius.xxl,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.border.strong,
        }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingBottom: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Шапка остаётся на месте; пустая область назад сохраняет выравнивание заголовка. */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              paddingBottom: theme.spacing.xs,
            }}
          >
            {step === "filters" ? (
              <View style={{ width: theme.spacing.xxxl }} />
            ) : (
              <IconButton
                icon="arrow-back"
                label="Назад к фильтрам"
                onPress={() => setStep("filters")}
              />
            )}
            <Text
              accessibilityRole="header"
              style={{
                flex: 1,
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
                fontSize: theme.typography.fontSize.title,
              }}
            >
              {title}
            </Text>
            <IconButton icon="close" label="Закрыть фильтры" onPress={close} />
          </View>

          {/* Фильтры прокручиваются над закреплённым действием, не вкладывая длинные списки друг в друга. */}
          {step === "filters" ? (
            <BottomSheetScrollView
              enableFooterMarginAdjustment
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                gap: theme.spacing.lg,
                paddingBottom: theme.spacing.lg,
              }}
            >
              <View>
                <ScopeField
                  label="Категория"
                  value={category?.name ?? "Все категории"}
                  onPress={() => {
                    Keyboard.dismiss();
                    setStep("category");
                  }}
                />
                <ScopeField
                  label="Подкатегория"
                  value={
                    subcategory?.name
                      ? `${subcategory.name}${subcategory.audience ? `, ${subcategory.audience}` : ""}`
                      : category
                        ? "Весь раздел"
                        : "Сначала выберите категорию"
                  }
                  disabled={!category}
                  onPress={() => {
                    Keyboard.dismiss();
                    setStep("subcategory");
                  }}
                />
              </View>
              <CatalogSearchFilters
                maxPrice={draft.maxPrice}
                onChangeMaxPrice={(maxPrice) =>
                  setDraft((value) => ({ ...value, maxPrice }))
                }
                sort={draft.sort}
                onChangeSort={(sort) =>
                  setDraft((value) => ({ ...value, sort }))
                }
              />
            </BottomSheetScrollView>
          ) : (
            <CatalogScopePicker
              key={step}
              items={
                step === "category"
                  ? [{ id: "", name: "Все категории" }, ...catalogCategories]
                  : [
                      { id: "", name: "Весь раздел" },
                      ...(category?.children ?? []),
                    ]
              }
              selectedId={
                step === "category" ? draft.categoryId : draft.subcategoryId
              }
              onSelect={(id) => {
                if (step === "category") {
                  setDraft((value) => ({
                    ...value,
                    categoryId: id,
                    subcategoryId:
                      value.categoryId === id ? value.subcategoryId : "",
                  }));
                  setStep(id ? "subcategory" : "filters");
                } else {
                  setDraft((value) => ({
                    ...value,
                    subcategoryId: id,
                  }));
                  setStep("filters");
                }
              }}
            />
          )}
        </View>
      </GenericBottomSheet>
    </View>
  );
}
