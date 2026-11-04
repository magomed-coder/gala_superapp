// components/ui/SectionTitle.tsx
import { Text } from "@/shared/components/text";

import React from "react";
import { StyleSheet, TextProps, TextStyle } from "react-native";

type SectionTitleProps = TextProps & {
  style?: TextStyle;
};

export const Title: React.FC<SectionTitleProps> = ({ children, style }) => {
  return (
    <Text variant="u700.22" style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    marginTop: 15,
    paddingHorizontal: 16,
    color: "#000",
  },
});
