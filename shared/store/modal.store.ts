import { create } from "zustand";

import type { ModalKind, ModalPayload, ModalType } from "@/shared/types/modal.types";

interface ModalStore {
  isVisible: boolean;
  type: ModalType;
  payload: ModalPayload | null;
  open: (type: ModalKind, payload?: ModalPayload) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isVisible: false,
  type: null,
  payload: null,

  open: (type, payload) =>
    set({
      isVisible: true,
      type,
      payload: payload ?? null,
    }),

  close: () =>
    set({
      isVisible: false,
      type: null,
      payload: null,
    }),
}));
