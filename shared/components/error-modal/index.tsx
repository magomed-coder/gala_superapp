import type { ModalPayload } from "@/shared/types/modal.types";

import { ModalCard } from "@/shared/components/modal-card";

export function ErrorModal(props: ModalPayload) {
  return (
    <ModalCard
      {...props}
      accentColor="#F04438"
      defaultTitle="Что-то пошло не так"
    />
  );
}
