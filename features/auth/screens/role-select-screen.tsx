import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "customer" | "seller" | null;

export default function RoleSelectScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleSelectRole = async (role: "customer" | "seller") => {
    try {
      // Сохранить роль пользователя
      console.log("Selected role:", role);
      // После выбора роли переход на основное приложение
      // router.replace('/(tabs)');
    } catch (error) {
      console.error("Role select error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Выберите роль</Text>
        <Text style={styles.subtitle}>
          Как вы хотите использовать приложение?
        </Text>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === "customer" && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole("customer")}
        >
          <Text style={styles.roleTitle}>👤 Покупатель</Text>
          <Text style={styles.roleDescription}>Покупайте товары и услуги</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === "seller" && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole("seller")}
        >
          <Text style={styles.roleTitle}>🏪 Продавец</Text>
          <Text style={styles.roleDescription}>Продавайте товары и услуги</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !selectedRole && styles.buttonDisabled]}
          onPress={() => selectedRole && handleSelectRole(selectedRole)}
          disabled={!selectedRole}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  roleCard: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  roleCardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
