import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import Switch from "@/shared/components/switch";
import { useAppTheme, type ThemeTokens } from "@/shared/theme";

export type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        activeTrackColor={theme.colors.brand.primary}
        inactiveTrackColor={theme.colors.border.default}
        thumbColor={theme.colors.background.primary}
      />
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border.subtle,
    },
    switchLabel: {
      fontSize: 15,
      color: theme.colors.text.primary,
      fontWeight: "500",
    },
  });
