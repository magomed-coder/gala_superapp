import { Text } from "@/components/ui/Text2";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StatusScreenProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text variant="u500.16" style={styles.title}>
        {title}
      </Text>

      {description && (
        <Text variant="u400.14" style={styles.description}>
          {description}
        </Text>
      )}

      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    backgroundColor: "#fff",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 200,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: 16,
  },
});
