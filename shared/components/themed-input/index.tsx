import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { ThemeTokens, useAppTheme } from "@/shared/theme";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  onFocus,
  onBlur,
  editable = true,
  ...props
}: InputProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isFocused, setIsFocused] = useState(false);

  const iconColor = error
    ? theme.colors.status.error
    : isFocused
      ? theme.colors.text.primary
      : theme.colors.text.tertiary;

  const borderColor = error
    ? theme.colors.status.error
    : isFocused
      ? theme.colors.brand.primary
      : theme.colors.border.default;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.medium,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: editable
              ? theme.colors.background.secondary
              : theme.colors.background.primary,
            borderRadius: theme.radius.md,
          },
          !editable && styles.disabled,
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={iconColor}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          {...props}
          editable={editable}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.regular,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={8}
            disabled={!onRightIconPress}
            style={({ pressed }) => [pressed && styles.iconPressed]}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={iconColor}
              style={styles.rightIcon}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          style={[
            styles.errorText,
            {
              color: theme.colors.status.error,
              fontFamily: theme.typography.fontFamily.regular,
            },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      minHeight: 44,
      paddingHorizontal: 6,
    },
    disabled: {
      opacity: 0.65,
    },
    input: {
      flex: 1,
      paddingHorizontal: 6,
      paddingVertical: 8,
      // backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.body,
    },
    leftIcon: {
      marginRight: 10,
    },
    rightIcon: {
      marginLeft: 10,
    },
    iconPressed: {
      opacity: 0.72,
    },
    errorText: {
      fontSize: 12,
      marginTop: 4,
    },
  });
