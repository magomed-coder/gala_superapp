import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface DividerProps {
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  color = "#EEEEEE",
  thickness = 1,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 12,
  },
});
