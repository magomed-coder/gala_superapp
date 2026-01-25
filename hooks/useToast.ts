// hooks/useToast.ts
import {
  ToastPosition,
  ToastType,
  useToastStore,
} from "@/contexts/toast.store";

interface ShowToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  onPress?: () => void;
  actionText?: string;
  onActionPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
  iconSet?: "Ionicons" | "MaterialIcons" | "FontAwesome" | "AntDesign";
}

export const useToast = () => {
  const { showToast, hideToast, hideAllToasts, updateToast } = useToastStore();

  const toast = {
    show: (options: ShowToastOptions) => showToast(options),

    success: (
      message: string,
      options?: Omit<ShowToastOptions, "message" | "type">
    ) => showToast({ message, type: "success", ...options }),
    // success: (message: string, options?: Partial<ShowToastOptions>) =>
    //   showToast({ message, type: "success", ...options }),

    // // или даже ещё короче и гибче (самый популярный стиль в 2025+):
    // success: (message: string, opts: Partial<Omit<ShowToastOptions, 'message' | 'type'>> = {}) =>
    //   showToast({ message, type: "success", ...opts }),

    error: (
      message: string,
      options?: Omit<ShowToastOptions, "message" | "type">
    ) => showToast({ message, type: "error", ...options }),

    warning: (
      message: string,
      options?: Omit<ShowToastOptions, "message" | "type">
    ) => showToast({ message, type: "warning", ...options }),

    info: (
      message: string,
      options?: Omit<ShowToastOptions, "message" | "type">
    ) => showToast({ message, type: "info", ...options }),

    hide: hideToast,
    hideAll: hideAllToasts,
    update: updateToast,
  };

  return toast;
};
