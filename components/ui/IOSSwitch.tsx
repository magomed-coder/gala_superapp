import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CONTAINER_WIDTH = 44;
const PADDING = 2;
const THUMB_WIDTH = 24;
const TRANSLATE_X = CONTAINER_WIDTH - PADDING * 2 - THUMB_WIDTH;

type IOSSwitchProps = {
  onValueChange: (newValue: boolean) => void;
  value: boolean;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  thumbColor?: string;
};

const IOSSwitch: React.FC<IOSSwitchProps> = ({
  onValueChange,
  value,
  activeTrackColor = "#28303E",
  inactiveTrackColor = "#E5E5EA",
  thumbColor = "#FFF",
}: IOSSwitchProps) => {
  const translateX = useSharedValue(value ? TRANSLATE_X : 0);

  useEffect(() => {
    translateX.value = withSpring(value ? TRANSLATE_X : 0, {
      damping: 15,
      stiffness: 120,
      mass: 1,
    });
  }, [value, translateX]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, TRANSLATE_X],
        [inactiveTrackColor, activeTrackColor]
      ),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = useCallback(() => {
    onValueChange(!value);
  }, [onValueChange, value]);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: thumbColor },
            thumbStyle,
            styles.shadow,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 28,
    padding: 2,
    borderRadius: 14,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
});

export default IOSSwitch;
