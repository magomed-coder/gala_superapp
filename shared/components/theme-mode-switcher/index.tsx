import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  useThemedStyles,
  type ThemePreference,
  type ThemeTokens,
} from "@/shared/theme";

const THEME_MODES = ["light", "dark", "system"] as const;

export type ThemeModeSwitcherProps = {
  themeMode: ThemePreference;
  onChange: (mode: ThemePreference) => void;
};

export function ThemeModeSwitcher({
  themeMode,
  onChange,
}: ThemeModeSwitcherProps) {
  const { theme, styles } = useThemedStyles(createStyles);

  return (
    <View
      style={[
        styles.segmentedControl,
        { backgroundColor: theme.colors.background.secondary },
      ]}
    >
      {THEME_MODES.map((mode) => {
        const iconName =
          mode === "light" ? "sunny" : mode === "dark" ? "moon" : "contrast";
        const isActive = themeMode === mode;

        return (
          <TouchableOpacity
            key={mode}
            style={[
              styles.segmentButton,
              isActive && { backgroundColor: theme.colors.brand.primary },
            ]}
            onPress={() => onChange(mode)}
            accessibilityRole="button"
            accessibilityLabel={mode}
          >
            <Ionicons
              name={iconName}
              size={14}
              color={
                isActive
                  ? theme.colors.brand.onPrimary
                  : theme.colors.text.secondary
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    segmentedControl: {
      flexDirection: "row",
      padding: theme.spacing.xxs,
      borderRadius: 0,
    },
    segmentButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
