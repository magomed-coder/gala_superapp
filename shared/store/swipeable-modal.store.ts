// store/modal.store.ts
import { create } from "zustand";

export type ModalPosition = "center" | "bottom" | "top";

export interface ModalConfig {
  id: string;
  title?: string;
  content: React.ReactNode;
  position?: ModalPosition;
  showCloseButton?: boolean;
  swipeToClose?: boolean;
  overlayOpacity?: number;
  backgroundColor?: string;
  borderRadius?: number;
  animationDuration?: number;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showHeader?: boolean;
  fullScreen?: boolean;
  disableBackdropPress?: boolean;
}

interface ModalStore {
  modals: ModalConfig[];
  showModal: (config: Omit<ModalConfig, "id">) => string;
  hideModal: (id: string) => void;
  hideAllModals: () => void;
  updateModal: (id: string, config: Partial<ModalConfig>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],

  showModal: (config) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newModal: ModalConfig = {
      id,
      position: "center",
      showCloseButton: true,
      swipeToClose: true,
      overlayOpacity: 0.5,
      animationDuration: 300,
      showHeader: true,
      fullScreen: false,
      disableBackdropPress: false,
      ...config,
    };

    set((state) => ({
      modals: [...state.modals, newModal],
    }));

    return id;
  },

  hideModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  hideAllModals: () => {
    set({ modals: [] });
  },

  updateModal: (id, config) => {
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === id ? { ...modal, ...config } : modal
      ),
    }));
  },
}));
