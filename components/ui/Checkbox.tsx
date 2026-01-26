import { MaterialIcons } from "@expo/vector-icons"; // ✅ Expo icons
import { memo, useCallback, useEffect, useState } from "react";
import {
  InteractionManager,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface DelayTypes {
  damping: number;
  mass: number;
  stiffness: number;
}

const DURATION: number = 300;
const CONFIG: DelayTypes = { damping: 12, mass: 1, stiffness: 200 };

interface Props {
  disable?: boolean;
  pressed?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isInteractive?: boolean;
}

export const Checkbox = memo(
  ({
    disable,
    pressed = false,
    onPress = () => {},
    style,
    isInteractive = true,
  }: Props) => {
    const checkBoxScale = useSharedValue<number>(0);
    const checkBoxOpacity = useSharedValue<number>(0);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    useEffect((): void => {
      setIsChecked(pressed);
    }, [pressed]);

    const onPressCheckBox = useCallback((): void => {
      if (!isInteractive) return;

      setIsChecked((prev: boolean) => !prev);
      if (typeof onPress === "function") {
        onPress();
      }
    }, [isInteractive, onPress]);

    const animatedCheckBoxStyle: ViewStyle = useAnimatedStyle(
      (): ViewStyle => ({
        opacity: checkBoxOpacity.value,
        transform: [{ scale: checkBoxScale.value }],
      }),
    );

    useEffect((): void => {
      InteractionManager.runAfterInteractions((): void => {
        checkBoxOpacity.value = withTiming(isChecked ? 1 : 0, {
          duration: DURATION,
        });
        checkBoxScale.value = isChecked
          ? withDelay(0, withSpring(1, CONFIG))
          : withDelay(0, withTiming(0));
      });
    }, [isChecked, checkBoxOpacity, checkBoxScale]);

    return (
      <TouchableOpacity
        disabled={disable}
        activeOpacity={1}
        onPress={onPressCheckBox}
        style={[
          styles.mainWrapper,
          disable && styles.disableMainWrapper,
          style,
        ]}
      >
        <Animated.View style={[animatedCheckBoxStyle]}>
          <MaterialIcons
            name={isChecked ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={disable ? "#A1A1AA" : "#28303E"} // ✅ hex цвета
            style={{
              transform: [{ scale: 1.2 }],
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

Checkbox.displayName = "Checkbox";

const styles = StyleSheet.create({
  mainWrapper: {
    width: 24,
    height: 24,
    borderRadius: 4,
    // backgroundColor: "#28303E", // серый фон
    backgroundColor: "#E5E5EA", // серый фон
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  disableMainWrapper: {
    backgroundColor: "#A1A1AA", // светло-серый
  },
});
