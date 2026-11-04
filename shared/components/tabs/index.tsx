import { useEffect } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemeTokens, useThemedStyles } from "@/shared/theme";

type Tab<T extends string> = {
  label: string;
  value: T;
};

// type IndicatorVariant = "block" | "underline" | "pill";

type TabsProps<T extends string> = {
  items: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
};

const CONTAINER_PADDING = 0;
const INDICATOR_PADDING = 2;

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: TabsProps<T>) {
  const { styles } = useThemedStyles(createStyles);

  const tabWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  const activeIndex = items.findIndex((i) => i.value === value);

  // синхронизация позиции индикатора при смене активного таба
  useEffect(() => {
    if (tabWidth.value === 0) return;

    indicatorX.value = withTiming(activeIndex * tabWidth.value, {
      duration: 200,
    });
  }, [activeIndex]);

  // измерение контейнера и расчет ширины таба
  const handleLayout = (e: LayoutChangeEvent) => {
    const width =
      (e.nativeEvent.layout.width -
        CONTAINER_PADDING * 2 -
        INDICATOR_PADDING * 2) /
      items.length;

    tabWidth.value = width;

    // начальная установка без анимации (чтобы не было рывка)
    indicatorX.value = activeIndex * width;
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: tabWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Animated.View
        pointerEvents="none"
        style={[styles.indicator, indicatorStyle]}
      />

      {items.map((item) => {
        const active = item.value === value;

        return (
          <Pressable
            key={item.value}
            style={styles.tab}
            onPress={() => onChange(item.value)}
          >
            <Text
              style={[styles.text, active && styles.textActive]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      position: "relative",
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      padding: CONTAINER_PADDING,
    },

    indicator: {
      position: "absolute",
      left: INDICATOR_PADDING,
      top: INDICATOR_PADDING,
      bottom: INDICATOR_PADDING,
      borderRadius: 8,
      backgroundColor: theme.colors.brand.primary,
    },

    tab: {
      flex: 1,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },

    text: {
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text.secondary,
    },

    textActive: {
      color: theme.colors.text.inverted,
    },
  });
