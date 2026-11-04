import { Modal, Pressable, StyleSheet } from "react-native";
import { useModalStore } from "@/shared/store/modal.store";
import { useThemedStyles, type ThemeTokens } from "@/shared/theme";

import { ConfirmModal } from "@/shared/components/confirm-modal";
import { ErrorModal } from "@/shared/components/error-modal";
import { SuccessModal } from "@/shared/components/success-modal";

export function GlobalModal() {
  const { isVisible, type, payload, close } = useModalStore();
  const { styles } = useThemedStyles(createStyles);

  const content = (() => {
    if (!payload) {
      return null;
    }

    if (type === "confirm") {
      return <ConfirmModal {...payload} />;
    }

    if (type === "success") {
      return <SuccessModal {...payload} />;
    }

    if (type === "error") {
      return <ErrorModal {...payload} />;
    }

    return null;
  })();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={close}
    >
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.container} onPress={() => {}}>
          {content}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background.overlay,
    },
    container: {
      width: "100%",
    },
  });
