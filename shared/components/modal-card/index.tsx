import { Pressable, StyleSheet, Text, View } from "react-native";
import { useModalStore } from "@/shared/store/modal.store";
import type { ModalPayload } from "@/shared/types/modal.types";
import { useThemedStyles, type ThemeTokens } from "@/shared/theme";

interface ModalCardProps extends ModalPayload {
  accentColor: string;
  defaultTitle: string;
}

export function ModalCard({
  title,
  description,
  content,
  actions,
  accentColor,
  defaultTitle,
}: ModalCardProps) {
  const close = useModalStore((state) => state.close);
  const { styles } = useThemedStyles(createStyles);
  const modalActions = actions?.length ? actions : [{ label: "OK" }];

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      <Text style={styles.title}>{title ?? defaultTitle}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {content ? <View style={styles.content}>{content}</View> : null}

      <View style={styles.actions}>
        {modalActions.map((action, index) => (
          <Pressable
            key={`${action.label}-${index}`}
            onPress={async () => {
              try {
                await action.onPress?.();
              } finally {
                close();
              }
            }}
            style={({ pressed }) => [
              styles.action,
              action.variant === "secondary" && styles.secondaryAction,
              action.variant === "danger" && styles.dangerAction,
              pressed && styles.actionPressed,
            ]}
          >
            <Text
              style={[
                styles.actionLabel,
                action.variant === "secondary" && styles.secondaryLabel,
                action.variant === "danger" && styles.dangerLabel,
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      width: "100%",
      borderRadius: 24,
      backgroundColor: theme.colors.background.elevated,
      padding: 20,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border.subtle,
    },
    accent: {
      height: 4,
      borderRadius: 999,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    description: {
      marginTop: 12,
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
    },
    content: {
      marginTop: 16,
    },
    actions: {
      marginTop: 24,
      gap: 12,
    },
    action: {
      minHeight: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      backgroundColor: theme.colors.brand.primary,
    },
    secondaryAction: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border.default,
    },
    dangerAction: {
      backgroundColor: theme.colors.status.error,
    },
    actionPressed: {
      opacity: 0.85,
    },
    actionLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.brand.onPrimary,
    },
    secondaryLabel: {
      color: theme.colors.text.primary,
    },
    dangerLabel: {
      color: theme.colors.text.inverted,
    },
  });
