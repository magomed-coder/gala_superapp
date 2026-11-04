import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/shared/theme";

type SearchBarProps = Omit<TextInputProps, "onChangeText" | "style"> & {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function SearchBar({
  value,
  onChangeText,
  onClear,
  style,
  inputStyle,
  onFocus,
  onBlur,
  placeholder = "Поиск...",
  editable = true,
  ...props
}: SearchBarProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  const iconColor = isFocused
    ? theme.colors.text.primary
    : theme.colors.text.tertiary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: editable
            ? theme.colors.background.secondary
            : theme.colors.background.primary,
          borderColor: isFocused
            ? theme.colors.brand.primary
            : theme.colors.border.default,
          borderRadius: theme.radius.md,
        },
        !editable && styles.disabled,
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={iconColor}
        style={styles.searchIcon}
      />

      <TextInput
        {...props}
        editable={editable}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        returnKeyType="search"
        autoCorrect={false}
        style={[
          styles.input,
          {
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.regular,
          },
          inputStyle,
        ]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
      />

      {value.length > 0 ? (
        <Pressable
          onPress={handleClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Очистить поиск"
          style={({ pressed }) => [pressed && styles.pressedIcon]}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={theme.colors.text.tertiary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      minHeight: 44,
      paddingHorizontal: 12,
      width: "100%",
    },
    disabled: {
      opacity: 0.65,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 0,
    },
    pressedIcon: {
      opacity: 0.72,
    },
  });
