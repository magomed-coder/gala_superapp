import { Text } from "@/shared/components/text";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "small" | "medium" | "large";
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  size = "medium",
}) => {
  const stars = Array.from({ length: 5 }).map((_, i) =>
    i < Math.floor(rating) ? "★" : "☆",
  );

  const sizes = {
    small: { fontSize: 12 },
    medium: { fontSize: 16 },
    large: { fontSize: 20 },
  };

  return (
    <View style={styles.container}>
      <Text style={sizes[size]} weight="semibold" color="#FFB800">
        {stars.join("")}
      </Text>
      {count && (
        <Text size="xs" color="#666666" style={styles.count}>
          {rating} ({count})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    marginLeft: 6,
  },
});
