import { memo, useCallback, useEffect, useState } from "react";
import {
  InteractionManager,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const DURATION = 200;
const CONFIG = { damping: 12, mass: 1, stiffness: 200 };
const BORDER_RADIUS = 1000;

interface RadioButtonProps {
  disable?: boolean;
  pressed?: boolean;
  onPressHandle?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const RadioButton = memo(
  ({
    disable,
    pressed = false,
    onPressHandle = () => {},
    style,
  }: RadioButtonProps) => {
    const radioButtonScale = useSharedValue(0);
    const radioButtonOpacity = useSharedValue(0);
    const [isChecked, setIsChecked] = useState(pressed);

    useEffect(() => {
      setIsChecked(pressed);
    }, [pressed]);

    const onPressCheckBox = useCallback(() => {
      onPressHandle();
    }, [onPressHandle]);

    const animatedCheckBoxStyle = useAnimatedStyle(() => ({
      opacity: radioButtonOpacity.value,
      transform: [{ scale: radioButtonScale.value }],
    }));

    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        radioButtonOpacity.value = withTiming(isChecked ? 1 : 0, {
          duration: DURATION,
        });
        radioButtonScale.value = isChecked
          ? withDelay(0, withSpring(1, CONFIG))
          : withDelay(0, withTiming(0));
      });
    }, [isChecked, radioButtonOpacity, radioButtonScale]);

    return (
      <TouchableOpacity
        disabled={disable}
        activeOpacity={1}
        onPress={onPressCheckBox}
        style={[styles.mainWrapper, disable && styles.disabledView, style]}
      >
        <Animated.View
          style={[
            styles.radioCheckedWrapper,
            disable && styles.disableCheckedWrapper,
            animatedCheckBoxStyle,
          ]}
        >
          <View style={styles.radioChecked} />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

RadioButton.displayName = "RadioButton";

const styles = StyleSheet.create({
  mainWrapper: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS,
    borderWidth: 2,
    borderColor: "#28303E",
    // backgroundColor: "#E0E0E0",

    alignItems: "center",
    justifyContent: "center",
  },
  disabledView: {
    borderColor: "#FFFFFF",
    opacity: 0.5,
    backgroundColor: "#FFFFFF",
  },
  radioCheckedWrapper: {
    width: 17,
    height: 17,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28303E",
  },
  disableCheckedWrapper: {
    // backgroundColor: "#616161",
  },
  radioChecked: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // backgroundColor: "#FFFFFF",
  },
});
