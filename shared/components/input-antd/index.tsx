import { Text } from "@/shared/components/text";
import { FONTS } from "@/shared/constants";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
  /** Лейбл (обязательный) */
  label: string;
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

export const InputAntd: React.FC<ThemedInputProps> = ({
  label,
  isFocused: externalFocused = false,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  inputStyle,
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
  const [isFocused, setIsFocused] = useState(false);
  const [hasText, setHasText] = useState(!!value);
  const translateY = useRef(new Animated.Value(0)).current;
  const fontSize = useRef(new Animated.Value(16)).current;
  const labelColor = useRef(new Animated.Value(0)).current;

  const textInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  // Анимация при изменении фокуса или текста
  useEffect(() => {
    const shouldFloat = isFocused || hasText;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: shouldFloat ? -28 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fontSize, {
        toValue: shouldFloat ? 12 : 16,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(labelColor, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, hasText, translateY, fontSize, labelColor]);

  // Обновление состояния при изменении value извне
  useEffect(() => {
    setHasText(!!value);
  }, [value]);

  // Синхронизация с externalFocused
  useEffect(() => {
    if (externalFocused !== undefined) {
      setIsFocused(externalFocused);
    }
  }, [externalFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    setHasText(!!value);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setHasText(!!text);
    onChangeText?.(text);
  };

  const handleContainerPress = () => {
    textInputRef.current?.focus();
  };

  // Интерполяция цвета лейбла
  const interpolatedLabelColor = labelColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#BCBBC1", "#192028"],
  });

  const errorColor = error ? "#EF4444" : undefined;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleContainerPress}
        style={[
          styles.container,
          inputContainerStyle,
          isFocused && styles.focused,
          !!error && styles.error,
        ]}
      >
        <View style={styles.inputWrapper}>
          {/* Анимированный лейбл */}
          <Animated.View
            style={[
              styles.labelContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.label,
                labelStyle,
                {
                  fontSize,
                  color: errorColor || interpolatedLabelColor,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Animated.Text>
          </Animated.View>

          {/* Поле ввода */}
          <TextInput
            ref={textInputRef}
            style={[
              styles.input,
              inputStyle,
              {
                paddingTop: hasText || isFocused ? 24 : 0,
              },
            ]}
            value={value}
            onChangeText={handleChangeText}
            secureTextEntry={secureTextEntry}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="" // Пустой плейсхолдер
            placeholderTextColor="transparent"
            {...rest}
          />
        </View>

        {/* Иконка справа */}
        {rightIcon ? (
          <TouchableOpacity
            onPress={onIconPress}
            style={[styles.iconContainer, iconContainerStyle]}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {/* Текст ошибки */}
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
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 6,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#BCBBC1",
    height: 56, // Фиксированная высота для контейнера
    position: "relative",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
    pointerEvents: "none", // Чтобы не блокировало нажатия на TextInput
  },
  label: {
    fontFamily: FONTS.UbuntuMedium,
    fontWeight: "500",
  },
  focused: {
    borderColor: "#192028",
  },
  input: {
    width: "100%",
    height: "100%",
    fontFamily: FONTS.UbuntuMedium,
    fontSize: 16,
    paddingVertical: 0,
    color: "#192028",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  error: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    marginTop: 4,
  },
});
