import { Text } from "@/components/ui/Text2";
import { FONTS } from "@/constants";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  isFocused?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  /** Иконка справа в поле ввода */
  rightIcon?: React.ReactNode;
  /** Обработчик нажатия на иконку */
  onIconPress?: () => void;
  iconContainerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

export const Input: React.FC<ThemedInputProps> = ({
  label = "",
  isFocused = false,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  inputStyle,
  placeholder = "",
  placeholderTextColor = "#BCBBC1",
  onFocus,
  onBlur,
  value,
  onChangeText,
  secureTextEntry = false,
  rightIcon,
  onIconPress,
  iconContainerStyle,
  error,
  ...rest
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text variant="u500.10" style={[styles.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.container,
          inputContainerStyle,
          isFocused && styles.focused,
          !!error && styles.error,
        ]}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          {...rest}
        />
        {rightIcon ? (
          <TouchableOpacity
            onPress={onIconPress}
            style={[styles.iconContainer, iconContainerStyle]}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
      {error && (
        <Text variant="u500.12" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    color: "#162635",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",

    overflow: "hidden",
    borderRadius: 12,
    paddingLeft: 5,
    paddingRight: 10,

    borderWidth: 1,
    borderColor: "#D0DFE8",
  },
  focused: {
    borderColor: "#162635",
  },
  input: {
    flex: 1,
    height: "100%",

    fontFamily: FONTS.UbuntuMedium,

    paddingVertical: 16,
  },
  iconContainer: {
    // paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    borderColor: "#D95757",
  },
  errorText: {
    color: "#D95757",
  },
});
