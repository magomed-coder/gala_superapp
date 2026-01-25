import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "../../../shared/components/ui";
import { useProfileStore } from "../../../shared/stores";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfileStore();

  const profileData = {
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text size="xl" weight="bold">
            Профиль
          </Text>
          <Text size="sm" color="#666666">
            Управляйте вашим аккаунтом
          </Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text size="2xl" weight="bold" color="#FFF">
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text size="lg" weight="bold">
                {profileData.firstName} {profileData.lastName}
              </Text>
              <Text size="sm" color="#666666">
                Участник с 2023 года
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 12 }}>
            <Divider />
          </View>
          <View style={styles.infoRow}>
            <Text size="sm" color="#666666">
              Email
            </Text>
            <Text size="sm" weight="semibold">
              {profileData.email}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text size="sm" color="#666666" style={{ marginTop: 8 }}>
              Телефон
            </Text>
            <Text size="sm" weight="semibold" style={{ marginTop: 8 }}>
              {profileData.phone}
            </Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Button
          label="Редактировать профиль"
          variant="primary"
          onPress={() => router.push("/(tabs)/profile/edit")}
          style={styles.actionButton}
        />

        <Button
          label="Мои адреса"
          variant="secondary"
          onPress={() => router.push("/(tabs)/profile/addresses")}
          style={styles.actionButton}
        />

        <Button
          label="Настройки"
          variant="secondary"
          onPress={() => router.push("/(tabs)/profile/settings")}
          style={styles.actionButton}
        />

        {/* Account Info */}
        <Card style={styles.infoCard}>
          <Text size="base" weight="semibold" style={{ marginBottom: 12 }}>
            Информация о аккаунте
          </Text>
          <View style={styles.infoRow}>
            <Text size="sm" color="#666666">
              Дата регистрации
            </Text>
            <Text size="sm" weight="semibold">
              15.01.2023
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text size="sm" color="#666666" style={{ marginTop: 8 }}>
              Статус
            </Text>
            <Text
              size="sm"
              weight="semibold"
              color="#10B981"
              style={{ marginTop: 8 }}
            >
              Активный
            </Text>
          </View>
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  profileCard: {
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoCard: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  editCard: {
    marginBottom: 16,
  },
  addressCard: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressText: {
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressActions: {
    flexDirection: "row",
    gap: 12,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 6,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  editButton: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 16,
  },
  dangerCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FED2D2",
  },
  settingsTitle: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  logoutButton: {
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 0,
  },
});
