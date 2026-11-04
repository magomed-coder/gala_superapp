import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

// Кастомная tabBarButton с haptic-откликом
export function HapticTab(props: any) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.(e);
      }}
      android_ripple={{ color: "#eee" }}
    >
      {props.children}
    </Pressable>
  );
}
