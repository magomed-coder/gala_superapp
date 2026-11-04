import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/shared/theme";

export type CheckboxProps = {
  checked: boolean;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  activeColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Checkbox({
  checked,
  label,
  onPress,
  disabled = false,
  activeColor,
  containerStyle,
  boxStyle,
  labelStyle,
}: CheckboxProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  const resolvedActiveColor = activeColor ?? theme.colors.brand.primary;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: checked ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [checked, scaleAnim]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.disabled,
        containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked
              ? resolvedActiveColor
              : theme.colors.border.default,
            backgroundColor: checked
              ? resolvedActiveColor
              : theme.colors.background.secondary,
            borderRadius: theme.radius.sm,
          },
          boxStyle,
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name="checkmark"
            size={14}
            color={theme.colors.brand.onPrimary}
          />
        </Animated.View>
      </View>

      <Text
        style={[
          styles.label,
          {
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.regular,
          },
          labelStyle,
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = () =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      gap: 10,
    },
    disabled: {
      opacity: 0.55,
    },
    pressed: {
      opacity: 0.82,
    },
    box: {
      width: 22,
      height: 22,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    label: {
      fontSize: 15,
      flexShrink: 1,
    },
  });
