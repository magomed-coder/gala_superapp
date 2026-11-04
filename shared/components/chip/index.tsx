import { Ionicons } from "@expo/vector-icons";
import { useMemo, type ComponentProps } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/shared/theme";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  selected,
  onPress,
  disabled = false,
  iconName,
  style,
}: ChipProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected
            ? theme.colors.brand.primary
            : theme.colors.border.default,
          backgroundColor: selected
            ? theme.colors.brand.primary
            : theme.colors.background.elevated,
          opacity: disabled ? 0.45 : 1,
        },
        style,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Ionicons
        name={iconName ?? (selected ? "checkbox-outline" : "square-outline")}
        size={14}
        color={
          selected ? theme.colors.brand.onPrimary : theme.colors.text.secondary
        }
      />
      <Text
        style={[
          styles.text,
          {
            color: selected
              ? theme.colors.brand.onPrimary
              : theme.colors.text.secondary,
            fontFamily: selected
              ? theme.typography.fontFamily.medium
              : theme.typography.fontFamily.regular,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = () =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderWidth: 1,
    },
    text: {
      fontSize: 12,
    },
    pressed: {
      opacity: 0.75,
    },
  });
