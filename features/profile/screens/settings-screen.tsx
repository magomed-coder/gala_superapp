import { Card } from "@/shared/components/card";
import { Divider } from "@/shared/components/divider";
import { Text } from "@/shared/components/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    orderUpdates: true,
    darkMode: false,
  });

  const auth = useAuthStore();

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backRow}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
            <Text size="lg" color="#FF6B6B" style={{ marginLeft: 8 }}>
              Назад
            </Text>
          </TouchableOpacity>
          <Text size="xl" weight="bold" style={{ marginTop: 8 }}>
            Настройки
          </Text>
        </View>

        {/* Notifications Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" weight="bold" style={styles.sectionTitle}>
            Уведомления
          </Text>

          <View style={styles.settingRow}>
            <Text size="base">Включить уведомления</Text>
            <Switch
              value={settings.notifications}
              onValueChange={() => toggleSetting("notifications")}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingRow}>
            <Text size="base">Email уведомления</Text>
            <Switch
              value={settings.emailNotifications}
              onValueChange={() => toggleSetting("emailNotifications")}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingRow}>
            <Text size="base">Уведомления о заказах</Text>
            <Switch
              value={settings.orderUpdates}
              onValueChange={() => toggleSetting("orderUpdates")}
            />
          </View>
        </Card>

        {/* Appearance Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" weight="bold" style={styles.sectionTitle}>
            Внешний вид
          </Text>

          <View style={styles.settingRow}>
            <Text size="base">Тёмная тема</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting("darkMode")}
            />
          </View>
        </Card>

        {/* Account Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" weight="bold" style={styles.sectionTitle}>
            Аккаунт
          </Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/(tabs)/profile/change-password")}
          >
            <Text size="base">Изменить пароль</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
          </TouchableOpacity>

          <Divider style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              auth.logout();
              router.replace("/(auth)/login");
            }}
          >
            <Text size="base">Выйти из аккаунта</Text>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
