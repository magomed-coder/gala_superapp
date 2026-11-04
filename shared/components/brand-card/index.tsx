import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BrandCardProps {
  name: string;
  logoUrl?: string | null;
  onPress: () => void;
}

export function BrandCard({ name, logoUrl, onPress }: BrandCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {logoUrl ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder} />
      )}
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 100,
    minHeight: 120,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    marginBottom: 8,
    backgroundColor: "#eee",
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
