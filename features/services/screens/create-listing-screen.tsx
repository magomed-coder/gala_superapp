import { useAuthStore } from "@/features/auth/store/use-auth-store";
import {
  loadListingDraft,
  saveListingDraft,
} from "@/features/services/api/listing-draft.api";
import { ListingPurchaseActions } from "@/features/services/components/listing-purchase-actions";
import { PurchaseModeSelector } from "@/features/services/components/purchase-mode-selector";
import type { ListingDraft } from "@/features/services/types/catalog.types";
import {
  getPurchaseCapabilities,
  parseListingPrice,
  validateListingDraft,
} from "@/features/services/utils/listing-purchase";
import { Button } from "@/shared/components/themed-button";
import { Input } from "@/shared/components/themed-input";
import { useAppTheme } from "@/shared/theme";
import { Stack } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emptyDraft: ListingDraft = {
  title: "",
  kind: "product",
  description: "",
  priceText: "",
  purchaseMode: null,
};

/** Открывает черновик текущего поставщика; смена аккаунта сбрасывает редактор и его локальное состояние. */
export default function CreateListingScreen() {
  const ownerId = useAuthStore((state) => state.user?.id ?? null);
  return (
    <DraftLoader
      key={ownerId === null ? "guest" : `user:${ownerId}`}
      ownerId={ownerId}
    />
  );
}

/** Загружает локальные данные до ввода, защищая форму от позднего ответа и предлагая повтор при ошибке. */
function DraftLoader({ ownerId }: { ownerId: string | null }) {
  const theme = useAppTheme();
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadListingDraft(ownerId).then(
      (saved) => {
        if (active) setDraft(saved ?? emptyDraft);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [ownerId, attempt]);

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <Stack.Screen
        options={{ headerShown: true, title: "Черновик предложения" }}
      />
      {/* До чтения сохранённых данных форма недоступна, поэтому введённый текст не перезаписывается. */}
      {draft ? (
        <DraftEditor ownerId={ownerId} initialDraft={draft} />
      ) : (
        <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            {failed
              ? "Не удалось открыть черновик. Сохранённые данные не изменены."
              : "Открываем черновик…"}
          </Text>
          {failed ? (
            <Button
              label="Повторить"
              onPress={() => {
                setFailed(false);
                setAttempt((value) => value + 1);
              }}
            />
          ) : (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{ gap: theme.spacing.lg }}
            >
              {/* Заглушки занимают места полей и вариантов до чтения черновика. */}
              {[1, 1, 2, 2, 2].map((lines, index) => (
                <View
                  key={index}
                  style={{
                    minHeight: theme.components.button.height * lines,
                    borderRadius: theme.radius.md,
                    backgroundColor: theme.colors.background.secondary,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

/** Позволяет поставщику явно выбрать режим, проверить действия покупателя и сохранить черновик на устройстве. */
function DraftEditor({
  ownerId,
  initialDraft,
}: {
  ownerId: string | null;
  initialDraft: ListingDraft;
}) {
  const theme = useAppTheme();
  const headerHeight = useHeaderHeight();
  const [draft, setDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const savingRef = useRef(false);
  const validation = validateListingDraft(draft);
  const { canBuy } = getPurchaseCapabilities(draft.purchaseMode);
  const bodyStyle = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  };

  /** Обновляет поля без автоматического выбора режима и снимает устаревшее подтверждение сохранения. */
  const updateDraft = (patch: Partial<ListingDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setStatus("");
  };

  /** Сохраняет один снимок формы; повторное нажатие не запускает параллельную запись. */
  const save = async () => {
    if (validation || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setStatus("");
    try {
      await saveListingDraft(ownerId, draft);
      setStatus(
        "Черновик сохранён на этом устройстве. Предложение ещё не опубликовано.",
      );
    } catch {
      setStatus(
        "Не удалось сохранить черновик. Повторите попытку — введённые данные остались в форме.",
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: theme.spacing.lg,
          gap: theme.spacing.lg,
        }}
      >
        {/* Поставщик видит реальный этап: локальный черновик, пока публикация в каталог не подключена. */}
        <Text style={bodyStyle}>
          Подготовьте товар или услугу. Пока можно сохранить черновик на
          устройстве; публикация в каталог ещё недоступна.
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          <Text style={bodyStyle}>Что предлагаете</Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            {(["product", "service"] as const).map((kind) => (
              <Pressable
                key={kind}
                accessibilityRole="radio"
                aria-checked={draft.kind === kind}
                aria-disabled={saving}
                accessibilityState={{
                  checked: draft.kind === kind,
                  disabled: saving,
                }}
                disabled={saving}
                onPress={() => updateDraft({ kind })}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: theme.components.button.height,
                  padding: theme.spacing.sm,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: theme.radius.md,
                  borderColor:
                    draft.kind === kind
                      ? theme.colors.brand.primary
                      : theme.colors.border.default,
                  opacity: pressed ? theme.opacity.pressed : 1,
                })}
              >
                <Text
                  style={{ ...bodyStyle, color: theme.colors.text.primary }}
                >
                  {kind === "product" ? "Товар" : "Услуга"}
                </Text>
              </Pressable>
            ))}
          </View>
          <Input
            label="Название"
            accessibilityLabel="Название предложения"
            value={draft.title}
            onChangeText={(title) => updateDraft({ title })}
            editable={!saving}
            maxLength={160}
          />
        </View>

        {/* Выбор одинаков для товаров и услуг, по умолчанию ни один режим не отмечен. */}
        <PurchaseModeSelector
          value={draft.purchaseMode}
          onChange={(purchaseMode) => updateDraft({ purchaseMode })}
          disabled={saving}
        />

        <View style={{ gap: theme.spacing.xs }}>
          <Input
            label={
              canBuy
                ? "Цена за единицу, ₽"
                : "Начальная цена, ₽ · необязательно"
            }
            accessibilityLabel="Цена предложения"
            keyboardType="decimal-pad"
            value={draft.priceText}
            onChangeText={(priceText) => updateDraft({ priceText })}
            editable={!saving}
            maxLength={16}
          />
          <Text style={bodyStyle}>
            {canBuy
              ? "Укажите фиксированную цену за одну единицу товара или один описанный объём услуги. Покупатель сможет выбрать количество."
              : "Если стоимость определяется после обсуждения, оставьте цену пустой."}
          </Text>
          <Input
            label="Описание и условия"
            accessibilityLabel="Описание и условия"
            value={draft.description}
            onChangeText={(description) => updateDraft({ description })}
            editable={!saving}
            multiline
            maxLength={4000}
            inputStyle={{
              minHeight: theme.spacing.xxxl * 2,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Предпросмотр сразу отражает выбор; в нём нельзя совершить заказ или отправить сообщение. */}
        <View style={{ gap: theme.spacing.sm }}>
          <Text
            accessibilityRole="header"
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.lg,
              fontFamily: theme.typography.fontFamily.medium,
            }}
          >
            Действия покупателя
          </Text>
          {draft.purchaseMode ? (
            <ListingPurchaseActions
              mode={draft.purchaseMode}
              unitPrice={parseListingPrice(draft.priceText)}
              notice="Предпросмотр: покупка и переписка здесь недоступны."
            />
          ) : (
            <Text style={bodyStyle}>
              Выберите способ заказа, чтобы увидеть кнопки покупателя.
            </Text>
          )}
        </View>

        {/* Постоянная область подсказки и кнопка с сохранением размера предотвращают сдвиги при записи. */}
        <View style={{ gap: theme.spacing.sm }}>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              ...bodyStyle,
              minHeight: theme.typography.lineHeight.md * 3,
            }}
          >
            {status || validation || "Можно сохранить черновик."}
          </Text>
          <Button
            label="Сохранить черновик"
            onPress={() => void save()}
            disabled={!!validation}
            loading={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
