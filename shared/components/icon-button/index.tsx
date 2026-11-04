import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";

type IconButtonProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** Кнопка с иконкой: подпись для диктора и постоянная область 48 pt при смене состояния. */
export function IconButton({
  icon,
  label,
  onPress,
  selected,
  disabled = false,
  color,
  style,
}: IconButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: theme.spacing.xxxl,
          height: theme.spacing.xxxl,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.full,
          opacity: disabled
            ? theme.opacity.disabled
            : pressed
              ? theme.opacity.pressed
              : 1,
        },
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={theme.components.icon.md}
        color={color ?? theme.colors.text.primary}
      />
    </Pressable>
  );
}
