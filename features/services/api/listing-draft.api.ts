import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ListingDraft } from "@/features/services/types/catalog.types";
import {
  isListingPurchaseMode,
  validateListingDraft,
} from "@/features/services/utils/listing-purchase";

/** Разделяет локальные черновики разных аккаунтов и гостя; не отправляет данные на сервер. */
function draftKey(ownerId: string | null) {
  return `listing-draft:v1:${ownerId === null ? "guest" : `user:${ownerId}`}`;
}

/** Читает локальный черновик; повреждённые данные не подменяются пустой формой. */
export async function loadListingDraft(
  ownerId: string | null,
): Promise<ListingDraft | null> {
  const raw = await AsyncStorage.getItem(draftKey(ownerId));
  if (!raw) return null;
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object")
    throw new Error("Invalid listing draft");
  const draft = value as Record<string, unknown>;
  if (
    typeof draft.title !== "string" ||
    typeof draft.description !== "string" ||
    typeof draft.priceText !== "string" ||
    (draft.kind !== "product" && draft.kind !== "service") ||
    !isListingPurchaseMode(draft.purchaseMode)
  )
    throw new Error("Invalid listing draft");
  return {
    title: draft.title,
    description: draft.description,
    priceText: draft.priceText,
    kind: draft.kind,
    purchaseMode: draft.purchaseMode,
  };
}

/** Сохраняет выбранный поставщиком режим вместе с предложением после проверки; публикацию не имитирует. */
export async function saveListingDraft(
  ownerId: string | null,
  draft: ListingDraft,
): Promise<void> {
  const error = validateListingDraft(draft);
  if (error) throw new Error(error);
  await AsyncStorage.setItem(draftKey(ownerId), JSON.stringify(draft));
}
