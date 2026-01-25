// components/SwipeableModal.tsx
import { ModalConfig, useModalStore } from "@/contexts/modal.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 100;
const MINIMUM_SWIPE_VELOCITY = 500;

interface SwipeableModalProps extends ModalConfig {
  onClose: () => void;
}

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  title,
  content,
  position = "center",
  showCloseButton = true,
  swipeToClose = true,
  overlayOpacity = 0.5,
  backgroundColor = "#ffffff",
  borderRadius = 16,
  animationDuration = 300,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showHeader = true,
  fullScreen = false,
  disableBackdropPress = false,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const overlayOpacityAnim = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const isSwiping = useSharedValue(false);
  const startY = useSharedValue(0);

  const getModalStyle = () => {
    switch (position) {
      case "bottom":
        return {
          position: "absolute" as const,
          bottom: 0,
          left: 0,
          right: 0,
          margin: fullScreen ? 0 : 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        };
      case "top":
        return {
          position: "absolute" as const,
          top: 0,
          left: 0,
          right: 0,
          margin: fullScreen ? 0 : 20,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        };
      case "center":
      default:
        return {
          position: "absolute" as const,
          top: SCREEN_HEIGHT * 0.1,
          left: fullScreen ? 0 : 20,
          right: fullScreen ? 0 : 20,
          maxHeight: fullScreen ? SCREEN_HEIGHT * 0.9 : SCREEN_HEIGHT * 0.8,
        };
    }
  };

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // Анимация появления
    overlayOpacityAnim.value = withTiming(overlayOpacity, {
      duration: animationDuration,
    });

    if (position === "center") {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 120,
      });
    } else {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 120,
      });
    }
  }, []);

  const panGesture = Gesture.Pan()
    .enabled(swipeToClose && (position === "bottom" || position === "top"))
    .onBegin(() => {
      isSwiping.value = true;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (position === "bottom") {
        translateY.value = Math.max(0, event.translationY);
      } else if (position === "top") {
        translateY.value = Math.min(0, event.translationY);
      }
    })
    .onEnd((event) => {
      isSwiping.value = false;

      const shouldClose =
        (position === "bottom" &&
          (event.translationY > SWIPE_THRESHOLD ||
            event.velocityY > MINIMUM_SWIPE_VELOCITY)) ||
        (position === "top" &&
          (event.translationY < -SWIPE_THRESHOLD ||
            event.velocityY < -MINIMUM_SWIPE_VELOCITY));

      if (shouldClose) {
        const direction = position === "bottom" ? 1 : -1;
        translateY.value = withTiming(
          direction * SCREEN_HEIGHT,
          { duration: 200 },
          () => {
            runOnJS(closeModal)();
          }
        );
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const backdropPressGesture = Gesture.Tap()
    .enabled(!disableBackdropPress)
    .onEnd(() => {
      closeModal();
    });

  const modalStyle = useAnimatedStyle(() => {
    const baseStyle = {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        ...(position === "center" ? [{ scale: scale.value }] : []),
      ],
    };

    return baseStyle;
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacityAnim.value,
  }));

  const getEnterAnimation = () => {
    switch (position) {
      case "bottom":
        return SlideInUp.springify().damping(15);
      case "top":
        return SlideInUp.springify().damping(15);
      case "center":
      default:
        return FadeIn.duration(animationDuration);
    }
  };

  const getExitAnimation = () => {
    switch (position) {
      case "bottom":
        return SlideOutDown.duration(200);
      case "top":
        return SlideOutDown.duration(200);
      case "center":
      default:
        return FadeOut.duration(200);
    }
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}
          {showCloseButton && (
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.headerDivider} />
      </View>
    );
  };

  const renderFooter = () => {
    if (!onConfirm) return null;

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={closeModal}
        >
          <Text style={styles.cancelButtonText}>{cancelText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={() => {
            if (onConfirm) onConfirm();
            closeModal();
          }}
        >
          <Text style={styles.confirmButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const modalContainerStyle = [
    styles.modalContainer,
    getModalStyle(),
    {
      backgroundColor,
      borderRadius: fullScreen ? 0 : borderRadius,
    },
    fullScreen && styles.fullScreen,
  ];

  return (
    <>
      <GestureDetector gesture={backdropPressGesture}>
        <Animated.View style={[styles.overlay, overlayStyle]} />
      </GestureDetector>

      <Animated.View
        entering={getEnterAnimation()}
        exiting={getExitAnimation()}
        style={modalContainerStyle}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            {/* Swipe indicator for bottom/top modals */}
            {(position === "bottom" || position === "top") && (
              <View style={styles.swipeIndicatorContainer}>
                <View style={styles.swipeIndicator} />
              </View>
            )}

            {renderHeader()}

            <View
              style={[
                styles.contentContainer,
                !showHeader && styles.contentWithoutHeader,
              ]}
            >
              {content}
            </View>

            {renderFooter()}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </>
  );
};

export const ModalContainer: React.FC = () => {
  const { modals, hideModal } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <View style={styles.modalsContainer} pointerEvents="box-none">
      {modals.map((modal) => (
        <SwipeableModal
          key={modal.id}
          {...modal}
          onClose={() => {
            if (modal.onClose) modal.onClose();
            hideModal(modal.id);
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 999,
  },
  modalContainer: {
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreen: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "100%",
  },
  modalContent: {
    flex: 1,
  },
  swipeIndicatorContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentWithoutHeader: {
    paddingTop: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  modalsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    pointerEvents: "box-none",
  },
});
