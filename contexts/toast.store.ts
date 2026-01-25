import { create } from "zustand";
import { devtools } from "zustand/middleware"; // ← полезно в разработке

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "bottom";

export interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
  onPress?: () => void;
  actionText?: string;
  onActionPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
  iconSet?: "Ionicons" | "MaterialIcons" | "FontAwesome" | "AntDesign";
}

interface ToastStore {
  toasts: ToastConfig[];
  showToast: (config: Partial<ToastConfig> & { message: string }) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  updateToast: (id: string, config: Partial<ToastConfig>) => void;
  toastCount: () => number;
  isToastActive: (id: string) => boolean;
  // Очень полезно в реальных приложениях:
  removeOldest: () => void;
}

const MAX_VISIBLE = 4; // ← ограничение количества одновременно видимых тостов

export const useToastStore = create<ToastStore>()(
  devtools(
    // ← опционально, но очень помогает при отладке
    (set, get) => ({
      toasts: [],

      showToast: (config) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        const newToast: ToastConfig = {
          id,
          message: config.message,
          type: config.type ?? "info",
          duration: config.duration ?? 3000,
          position: config.position ?? "bottom",
          onPress: config.onPress,
          actionText: config.actionText,
          onActionPress: config.onActionPress,
          backgroundColor: config.backgroundColor,
          textColor: config.textColor,
          icon: config.icon,
          iconSet: config.iconSet,
        };

        set((state) => {
          // Если уже слишком много — удаляем самый старый
          if (state.toasts.length >= MAX_VISIBLE) {
            const [, ...rest] = state.toasts;
            return { toasts: [...rest, newToast] };
          }

          return { toasts: [...state.toasts, newToast] };
        });

        return id;
      },

      hideToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      hideAllToasts: () => set({ toasts: [] }),

      updateToast: (id, config) =>
        set((state) => ({
          toasts: state.toasts.map((t) =>
            t.id === id ? { ...t, ...config } : t
          ),
        })),

      toastCount: () => get().toasts.length,

      isToastActive: (id) => get().toasts.some((t) => t.id === id),

      // Полезный метод для очистки старых тостов
      removeOldest: () =>
        set((state) => {
          if (state.toasts.length === 0) return state;
          const [, ...rest] = state.toasts;
          return { toasts: rest };
        }),
    }),
    { name: "ToastStore" } // имя в devtools — удобно искать
  )
);
