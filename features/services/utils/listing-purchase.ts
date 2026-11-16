import type {
  ListingDraft,
  ListingPurchaseMode,
} from "@/features/services/types/catalog.types";

export const MAX_PURCHASE_QUANTITY = 999;

/** Ограничивает целое количество допустимым диапазоном одного заказа, не обозначая складской остаток. */
export function clampPurchaseQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_PURCHASE_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

/** Считает сумму в копейках, чтобы дробные цены не накапливали погрешность при умножении. */
export function calculatePurchaseTotal(
  unitPrice: number | null,
  quantity: number,
): number | null {
  if (unitPrice === null || !Number.isFinite(unitPrice) || unitPrice <= 0)
    return null;
  const totalKopecks =
    Math.round(unitPrice * 100) * clampPurchaseQuantity(quantity);
  return totalKopecks > 0 && Number.isSafeInteger(totalKopecks)
    ? totalKopecks / 100
    : null;
}

export const purchaseModeOptions: readonly {
  value: ListingPurchaseMode;
  label: string;
  description: string;
}[] = [
  {
    value: "purchase",
    label: "Покупка",
    description: "Заказ по фиксированной цене с указанными условиями.",
  },
  {
    value: "negotiation",
    label: "По согласованию",
    description: "Сначала обсудить детали и итоговую стоимость с вами.",
  },
  {
    value: "both",
    label: "Оба варианта",
    description: "Купить по указанной цене или обсудить индивидуальный заказ.",
  },
];

/** Проверяет сохранённый или полученный извне способ заказа без неявного выбора покупки. */
export function isListingPurchaseMode(
  value: unknown,
): value is ListingPurchaseMode {
  return purchaseModeOptions.some((option) => option.value === value);
}

/** Определяет действия покупателя независимо от того, товар это или услуга. */
export function getPurchaseCapabilities(mode: ListingPurchaseMode | null) {
  return {
    canBuy: mode === "purchase" || mode === "both",
    canDiscuss: mode === "negotiation" || mode === "both",
  };
}

/** Преобразует рубли с запятой или точкой; отвергает отрицательные суммы, экспоненты и лишние копейки. */
export function parseListingPrice(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const price = Number(normalized);
  return price > 0 && Number.isSafeInteger(Math.round(price * 100))
    ? price
    : null;
}

/** Проверяет обязательный выбор поставщика и цену до сохранения подготовленного предложения. */
export function validateListingDraft(draft: ListingDraft): string | null {
  if (!draft.title.trim()) return "Укажите название предложения.";
  if (!isListingPurchaseMode(draft.purchaseMode))
    return "Выберите способ заказа.";
  if (!draft.description.trim()) return "Опишите предложение и условия заказа.";
  const { canBuy } = getPurchaseCapabilities(draft.purchaseMode);
  if (
    (canBuy || draft.priceText.trim()) &&
    parseListingPrice(draft.priceText) === null
  ) {
    return canBuy
      ? "Для покупки укажите фиксированную цену больше нуля, не более двух знаков после запятой."
      : "Укажите корректную начальную цену или оставьте поле пустым.";
  }
  return null;
}
