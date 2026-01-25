import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/ui/Text"; // твой компонент текста

// --- Небольшой локальный Checkbox (можно вынести в файл) ---
export const Checkbox: React.FC<{
  checked: boolean;
  label: string;
  onPress: () => void;
}> = ({ checked, label, onPress }) => {
  return (
    <TouchableOpacity
      style={cbStyles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[cbStyles.box, checked && cbStyles.boxChecked]}>
        {checked && <Text style={cbStyles.check}>✓</Text>}
      </View>
      <Text variant="u400.15">{label}</Text>
    </TouchableOpacity>
  );
};

const cbStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: "#28303E",
    borderColor: "#28303E",
  },
  check: {
    color: "white",
  },
});
