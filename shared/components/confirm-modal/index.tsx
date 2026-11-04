import type { ModalPayload } from "@/shared/types/modal.types";

import { ModalCard } from "@/shared/components/modal-card";

export function ConfirmModal(props: ModalPayload) {
  return (
    <ModalCard
      {...props}
      accentColor="#F79009"
      defaultTitle="Подтвердите действие"
    />
  );
}
