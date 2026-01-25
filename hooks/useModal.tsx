import { ModalConfig, useModalStore } from "@/contexts/modal.store";
import React from "react";
import { Text } from "react-native";

interface ShowModalOptions extends Omit<ModalConfig, "id"> {
  content: React.ReactNode;
}

export const useModal = () => {
  const { showModal, hideModal, hideAllModals, updateModal } = useModalStore();

  /**
   * Базовый show
   */
  const show = (options: ShowModalOptions) => {
    return showModal(options);
  };

  /**
   * Alert (аналог Alert.alert)
   */
  const alert = (
    title: string,
    message: string,
    confirmText: string = "OK"
  ) => {
    const modalId = showModal({
      title,
      content: <AlertContent message={message} />,
      position: "center",
      showHeader: true,
      confirmText,
      onConfirm: () => hideModal(modalId),
      onClose: () => hideModal(modalId),
    });

    return modalId;
  };

  /**
   * Confirm
   */
  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = "Confirm",
    cancelText: string = "Cancel"
  ) => {
    const modalId = showModal({
      title,
      content: <ConfirmContent message={message} />,
      position: "center",
      showHeader: true,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm();
        hideModal(modalId);
      },
      onClose: () => hideModal(modalId),
    });

    return modalId;
  };

  /**
   * Bottom sheet
   */
  const bottomSheet = (content: React.ReactNode, title?: string) => {
    return showModal({
      title,
      content,
      position: "bottom",
      swipeToClose: true,
      overlayOpacity: 0.5,
    });
  };

  /**
   * Fullscreen modal
   */
  const fullScreen = (content: React.ReactNode, title?: string) => {
    return showModal({
      title,
      content,
      position: "center",
      fullScreen: true,
      backgroundColor: "#fff",
    });
  };

  return {
    show,
    alert,
    confirm,
    bottomSheet,
    fullScreen,
    hide: hideModal,
    hideAll: hideAllModals,
    update: updateModal,
  };
};

/* -------------------------------------------------------------------------- */
/*                               CONTENT BLOCKS                               */
/* -------------------------------------------------------------------------- */

const AlertContent: React.FC<{ message: string }> = ({ message }) => (
  <Text
    style={{
      fontSize: 16,
      color: "#666",
      lineHeight: 24,
      textAlign: "center",
      paddingVertical: 10,
    }}
  >
    {message}
  </Text>
);

const ConfirmContent: React.FC<{ message: string }> = ({ message }) => (
  <Text
    style={{
      fontSize: 16,
      color: "#666",
      lineHeight: 24,
      textAlign: "center",
      paddingVertical: 10,
    }}
  >
    {message}
  </Text>
);
