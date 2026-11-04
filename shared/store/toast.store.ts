import { create } from "zustand";

export type ToastKind = "info" | "success" | "error";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastKind;
  duration: number;
};

type ShowToastInput = {
  message: string;
  type?: ToastKind;
  duration?: number;
};

type ToastStore = {
  toasts: ToastItem[];
  show: (input: ShowToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const DEFAULT_DURATION_MS = 3200;

const generateToastId = () =>
  `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  show: ({ message, type = "info", duration = DEFAULT_DURATION_MS }) => {
    const id = generateToastId();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          type,
          duration,
        },
      ],
    }));

    return id;
  },

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clear: () => set({ toasts: [] }),
}));
