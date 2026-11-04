import { useToastStore, type ToastKind } from "@/shared/store/toast.store";

type ToastOptions = {
  duration?: number;
};

const show = (message: string, type: ToastKind, options?: ToastOptions) => {
  return useToastStore.getState().show({
    message,
    type,
    duration: options?.duration,
  });
};

export const toast = {
  message: (message: string, options?: ToastOptions) =>
    show(message, "info", options),
  info: (message: string, options?: ToastOptions) =>
    show(message, "info", options),
  success: (message: string, options?: ToastOptions) =>
    show(message, "success", options),
  error: (message: string, options?: ToastOptions) =>
    show(message, "error", options),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
  clear: () => useToastStore.getState().clear(),
};
