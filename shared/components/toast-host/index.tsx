import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme, type ThemeTokens } from "@/shared/theme";
import { useToastStore } from "@/shared/store/toast.store";
import type { ToastItem } from "@/shared/store/toast.store";

function ToastCard({ toast }: { toast: ToastItem }) {
  const theme = useAppTheme();
  const dismiss = useToastStore((state) => state.dismiss);
  const styles = createStyles(theme);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dismiss(toast.id);
    }, toast.duration);

    return () => clearTimeout(timeout);
  }, [dismiss, toast.duration, toast.id]);

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  const iconName = isSuccess
    ? "checkmark-circle"
    : isError
      ? "alert-circle"
      : "information-circle";

  const accentColor = isSuccess
    ? theme.colors.status.success
    : isError
      ? theme.colors.status.error
      : theme.colors.status.info;

  return (
    <Animated.View
      entering={FadeInDown.duration(220).easing(Easing.out(Easing.cubic))}
      exiting={FadeOutUp.duration(160).easing(Easing.in(Easing.cubic))}
      layout={LinearTransition.springify()}
      style={styles.cardWrap}
    >
      <Pressable
        style={[
          styles.card,
          {
            borderColor: theme.colors.border.subtle,
            backgroundColor: theme.colors.background.elevated,
          },
        ]}
        onPress={() => dismiss(toast.id)}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}
        >
          <Ionicons name={iconName} size={18} color={accentColor} />
        </View>

        <Text
          style={[
            styles.message,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.medium,
            },
          ]}
          numberOfLines={3}
        >
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((state) => state.toasts);
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (!toasts.length) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        style={[styles.container, { top: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 12,
      right: 12,
      zIndex: 1200,
      gap: 8,
    },
    cardWrap: {
      width: "100%",
    },
    card: {
      minHeight: 48,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 10,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    message: {
      flex: 1,
      fontSize: theme.typography.fontSize.body,
      lineHeight: theme.typography.lineHeight.body,
    },
  });
