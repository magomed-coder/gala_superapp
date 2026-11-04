import { useMemo, useState, type ReactNode } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeOutDown,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";

import { useAppTheme, type ThemeTokens } from "@/shared/theme";

export type SelectorItem = {
  id: string | number;
  label: string;
  icon?: string;
};

type SelectorProps = {
  items: SelectorItem[];
  onSelect: (item: SelectorItem) => void;
  triggerComponent?: ReactNode;
  segmentHeight?: number;
  movingWidth?: number;
  popupBackgroundColor?: string;
  indicatorColor?: string;
  textColor?: string;
  activeTextColor?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_SPRING = { damping: 15, stiffness: 120 };

export function Selector({
  items = [],
  onSelect,
  triggerComponent,
  segmentHeight = 55,
  movingWidth = 180,
  popupBackgroundColor,
  indicatorColor,
  textColor,
  activeTextColor,
  style,
}: SelectorProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isOpen, setIsOpen] = useState(false);

  const movingHeight = segmentHeight - 8;
  const upperBounds = -(items.length * segmentHeight + 20);
  const lowerBounds = 0;

  const resolvedPopupBackgroundColor =
    popupBackgroundColor ?? theme.colors.background.elevated;
  const resolvedIndicatorColor =
    indicatorColor ?? theme.colors.background.secondary;
  const resolvedTextColor = textColor ?? theme.colors.text.secondary;
  const resolvedActiveTextColor = activeTextColor ?? theme.colors.text.primary;

  const tapScale = useSharedValue(0);
  const containerStretch = useSharedValue(0);
  const enableSelection = useSharedValue(0);
  const currentTarget = useSharedValue(-1);
  const selectedTranslate = useSharedValue(0);
  const enableSpringTranslation = useSharedValue(1);
  const activatedFromTap = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      tapScale.value = withSpring(1, DEFAULT_SPRING);
    })
    .onFinalize(() => {
      tapScale.value = withSpring(0, DEFAULT_SPRING);
    });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsOpen)(true);
    })
    .onUpdate((event) => {
      if (items.length === 0) {
        return;
      }

      if (event.y < lowerBounds) {
        if (event.y > upperBounds) {
          containerStretch.value = 0;
          const indexFactor = Math.floor(Math.abs(event.y) / segmentHeight);

          if (activatedFromTap.value) {
            if (enableSpringTranslation.value) {
              selectedTranslate.value = -(segmentHeight * indexFactor);
              enableSpringTranslation.value = 0;
            } else {
              selectedTranslate.value = withSpring(
                -(segmentHeight * indexFactor),
                DEFAULT_SPRING,
              );
            }

            currentTarget.value = indexFactor;
            enableSelection.value = withSpring(1, DEFAULT_SPRING);
          }
        } else {
          containerStretch.value = Math.floor(
            Math.abs(event.y) % Math.abs(upperBounds),
          );
          enableSelection.value = withSpring(0, DEFAULT_SPRING);
          currentTarget.value = -1;
        }
      } else {
        if (event.y > 0 && event.translationY > 0) {
          containerStretch.value = activatedFromTap.value
            ? Math.round(event.y)
            : Math.round(event.translationY);
        }

        enableSelection.value = withSpring(0, DEFAULT_SPRING);
        currentTarget.value = -1;
      }
    })
    .onEnd(() => {
      containerStretch.value = withSpring(0, DEFAULT_SPRING);

      if (currentTarget.value >= 0 && currentTarget.value < items.length) {
        const reversedItems = [...items].reverse();
        const selectedItem = reversedItems[currentTarget.value];
        runOnJS(onSelect)(selectedItem);
      }

      runOnJS(setIsOpen)(false);
      tapScale.value = withSpring(0, DEFAULT_SPRING);
      enableSelection.value = withSpring(0);
      currentTarget.value = -1;
      activatedFromTap.value = 1;
      enableSpringTranslation.value = 1;
    });

  const composedGesture = Gesture.Exclusive(tapGesture, panGesture);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(tapScale.value, [0, 1], [1, 0.95]) }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    zIndex: interpolate(
      enableSelection.value,
      [0, 1],
      [-1, 10],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      enableSelection.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      { translateY: selectedTranslate.value },
      {
        scale: interpolate(
          enableSelection.value,
          [0, 1],
          [1, 1.04],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const stretchStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          containerStretch.value,
          [-50, 0, 50],
          [1.05, 1, 0.95],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.wrapper, style, scaleStyle]}>
        {isOpen && items.length > 0 ? (
          <Animated.View
            entering={FadeInDown.springify()}
            exiting={FadeOutDown.duration(150)}
            style={[
              styles.popupContainer,
              {
                bottom: segmentHeight + 10,
                minWidth: movingWidth + 8,
                backgroundColor: resolvedPopupBackgroundColor,
              },
              stretchStyle,
            ]}
          >
            <Animated.View
              style={[
                styles.indicator,
                {
                  height: movingHeight,
                  width: movingWidth,
                  backgroundColor: resolvedIndicatorColor,
                },
                indicatorStyle,
              ]}
            />

            {items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                currentTarget={currentTarget}
                segmentHeight={segmentHeight}
                movingWidth={movingWidth}
                textColor={resolvedTextColor}
                activeTextColor={resolvedActiveTextColor}
                theme={theme}
              />
            ))}
          </Animated.View>
        ) : null}

        {triggerComponent ? (
          triggerComponent
        ) : (
          <View style={styles.defaultButton}>
            <Text style={styles.defaultButtonText}>^</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

type ItemRowProps = {
  item: SelectorItem;
  index: number;
  currentTarget: SharedValue<number>;
  segmentHeight: number;
  movingWidth: number;
  textColor: string;
  activeTextColor: string;
  theme: ThemeTokens;
};

function ItemRow({
  item,
  index,
  currentTarget,
  segmentHeight,
  movingWidth,
  textColor,
  activeTextColor,
  theme,
}: ItemRowProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const isSelected = currentTarget.value === index;

    return {
      color: isSelected ? activeTextColor : textColor,
      opacity: isSelected ? 1 : 0.6,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const isSelected = currentTarget.value === index;

    return {
      opacity: isSelected ? 1 : 0.92,
    };
  });

  return (
    <Animated.View
      style={[
        styles.row,
        { height: segmentHeight, width: movingWidth },
        animatedContainerStyle,
      ]}
    >
      {item.icon ? (
        <Image source={{ uri: item.icon }} style={styles.iconImage} />
      ) : null}
      <Animated.Text
        style={[
          styles.rowText,
          {
            fontFamily: theme.typography.fontFamily.medium,
          },
          animatedTextStyle,
        ]}
      >
        {item.label}
      </Animated.Text>
    </Animated.View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    wrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    popupContainer: {
      position: "absolute",
      alignItems: "center",
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      shadowOpacity: 0.15,
      elevation: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border.subtle,
      zIndex: 99,
    },
    indicator: {
      position: "absolute",
      bottom: 4,
      borderRadius: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      zIndex: 20,
    },
    iconImage: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 12,
      backgroundColor: theme.colors.background.secondary,
    },
    rowText: {
      fontSize: 14,
      color: theme.colors.text.primary,
    } as TextStyle,
    defaultButton: {
      height: 56,
      width: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.text.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      shadowOpacity: 0.2,
      elevation: 5,
    },
    defaultButtonText: {
      color: theme.colors.background.primary,
      fontSize: 20,
      fontFamily: theme.typography.fontFamily.bold,
    },
  });
