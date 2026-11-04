// components/SwipeableToast.tsx
import { ToastConfig, useToastStore } from "@/shared/store/swipeable-toast.store";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 60;

type IconSet = "Ionicons" | "MaterialIcons" | "FontAwesome" | "AntDesign";

interface SwipeableToastProps extends ToastConfig {
  onHide: () => void;
  showCloseButton?: boolean;
  showProgressBar?: boolean;
  animationType?: "slide" | "fade";
  swipeToClose?: boolean;
}

export const SwipeableToast: React.FC<SwipeableToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  position = "bottom",
  onHide,
  onPress,
  showCloseButton = true,
  showProgressBar = true,
  animationType = "slide",
  swipeToClose = true,
  backgroundColor,
  textColor,
  icon,
  iconSet = "Ionicons",
  actionText,
  onActionPress,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const progress = useSharedValue(100);
  const isSwiping = useSharedValue(false);
  const startX = useSharedValue(0);

  const getTypeStyles = () => {
    const defaultStyles = {
      success: {
        bg: "#10b981",
        icon: "checkmark-circle",
        iconSet: "Ionicons" as IconSet,
        progressColor: "#059669",
      },
      error: {
        bg: "#ef4444",
        icon: "close-circle",
        iconSet: "Ionicons" as IconSet,
        progressColor: "#dc2626",
      },
      warning: {
        bg: "#f59e0b",
        icon: "warning",
        iconSet: "Ionicons" as IconSet,
        progressColor: "#d97706",
      },
      info: {
        bg: "#3b82f6",
        icon: "information-circle",
        iconSet: "Ionicons" as IconSet,
        progressColor: "#2563eb",
      },
    };

    if (icon && iconSet) {
      return {
        ...defaultStyles[type],
        icon,
        iconSet,
      };
    }

    return defaultStyles[type];
  };

  const typeStyles = getTypeStyles();

  const renderIcon = () => {
    const { iconSet: currentIconSet, icon: iconName } = typeStyles;
    const size = 24;
    const color = textColor || "#fff";

    if (!iconName) {
      return (
        <Ionicons name="information" size={24} color={textColor || "#fff"} />
      );
    }

    switch (currentIconSet) {
      case "MaterialIcons":
        return (
          <MaterialIcons name={iconName as any} size={size} color={color} />
        );
      case "FontAwesome":
        return <FontAwesome name={iconName as any} size={size} color={color} />;
      case "AntDesign":
        return <AntDesign name={iconName as any} size={size} color={color} />;
      case "Ionicons":
      default:
        return <Ionicons name={iconName as any} size={size} color={color} />;
    }
  };

  const hideToast = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onHide)();
      }
    });
  }, [onHide, opacity]);

  // Auto-hide timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (!isSwiping.value) {
          hideToast();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, hideToast, isSwiping.value]);

  // Progress bar animation
  useEffect(() => {
    if (showProgressBar && duration > 0) {
      progress.value = withTiming(0, { duration });
    }
  }, [duration, showProgressBar, progress]);

  const panGesture = Gesture.Pan()
    .enabled(swipeToClose)
    .onBegin(() => {
      isSwiping.value = true;
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = event.translationY * 0.3;

      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY * 0.5;
      }
    })
    .onEnd((event) => {
      isSwiping.value = false;

      const shouldDismiss =
        Math.abs(event.translationX) > SWIPE_THRESHOLD ||
        Math.abs(event.velocityX) > 500;

      if (shouldDismiss) {
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withSpring(direction * SCREEN_WIDTH, {
          velocity: event.velocityX,
        });
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
        translateY.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value / 20;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const getEnterAnimation = () => {
    if (animationType === "fade") {
      return FadeIn.duration(300);
    }
    return position === "bottom"
      ? SlideInDown.springify().damping(15)
      : SlideInDown.springify().damping(15);
  };

  const getExitAnimation = () => {
    if (animationType === "fade") {
      return FadeOut.duration(200);
    }
    return SlideOutDown.duration(200);
  };

  return (
    <Animated.View
      entering={getEnterAnimation()}
      exiting={getExitAnimation()}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || typeStyles.bg,
          [position]: 20,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.toastContainer, animatedStyle]}>
          <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>{renderIcon()}</View>

              <View style={styles.textContainer}>
                <Text
                  style={[styles.message, { color: textColor || "#fff" }]}
                  numberOfLines={3}
                >
                  {message}
                </Text>

                {actionText && onActionPress && (
                  <TouchableWithoutFeedback onPress={onActionPress}>
                    <View style={styles.actionContainer}>
                      <Text style={styles.actionText}>{actionText}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>

              {showCloseButton && (
                <TouchableWithoutFeedback onPress={hideToast}>
                  <View style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </TouchableWithoutFeedback>

          {showProgressBar && duration > 0 && (
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: typeStyles.progressColor },
                progressBarStyle,
              ]}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToastStore();

  return (
    <View style={styles.allToastContainer} pointerEvents="box-none">
      {toasts.map((toast, index) => (
        <SwipeableToast
          key={toast.id}
          {...toast}
          onHide={() => hideToast(toast.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
    zIndex: 9999,
  },
  toastContainer: {
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 60,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  progressBar: {
    height: 3,
    position: "absolute",
    bottom: 0,
    left: 0,
    borderRadius: 1.5,
  },
  allToastContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "box-none",
  },
});
