import { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme, type ThemeTokens } from "@/shared/theme";

export type SectionProps = {
  title: string;
  children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    section: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    sectionBody: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      borderRadius: 12,
      overflow: "hidden",
    },
  });
