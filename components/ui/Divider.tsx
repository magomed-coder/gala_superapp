// components/ui/Divider.tsx
import { Colors } from "@/lib/design-system";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface DividerProps {
  vertical?: boolean;
  style?: ViewStyle;
  color?: string;
}

export default function Divider({
  vertical = false,
  style,
  color = Colors.gray[200],
}: DividerProps) {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
});
