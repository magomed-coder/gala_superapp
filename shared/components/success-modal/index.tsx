import type { ModalPayload } from "@/shared/types/modal.types";

import { ModalCard } from "@/shared/components/modal-card";

export function SuccessModal(props: ModalPayload) {
  return <ModalCard {...props} accentColor="#12B76A" defaultTitle="Готово" />;
}
